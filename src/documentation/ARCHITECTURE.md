# IoT Dashboard v2 — Architecture

## 1. Overview

Next.js 16 (App Router) frontend for an IoT pump-monitoring platform. Backend is a FastAPI service (`NEXT_PUBLIC_API_URL`) reached through a same-origin proxy. Authentication uses a JWT stored in a cookie (`auth-token`), consumed by **both** server components (via `getServerUser`) and the browser Axios client.

- **Framework:** Next.js 16 App Router, React 19, TypeScript strict
- **Styling:** TailwindCSS 4, shadcn/ui primitives, base-ui dialogs
- **Data:** TanStack Query v5 for client cache, React Hook Form + Zod for forms
- **State:** Zustand (persisted) for client user snapshot
- **Runtime auth:** cookie-based JWT, `SameSite=Lax`, 7-day max-age
- **Transport:** Axios → `/api/proxy/**` → FastAPI

## 2. High-Level Topology

```
Browser
  │
  │  (1) Next.js server renders protected routes
  │  (2) getServerUser() reads cookie → GET {API}/auth/me
  │  (3) returns UserResponse → layout gates on role
  ▼
Next.js 16 (App Router)
  ├── middleware.ts          edge redirect: protect /dashboard/*, bounce logged-in users off "/"
  ├── app/layout.tsx         providers (React Query, theme, toaster)
  ├── app/dashboard/layout   server gate: user must exist, role !== USER
  ├── app/api/proxy/[...path]/route.ts
  │                           forwards every verb to FastAPI; handles 307/308 redirect;
  │                           strips accept-encoding / content-encoding
  └── view/dashboard/*       feature views (dashboard, device, user, activity, profile)
         │
         │  axios (baseURL = /api/proxy)   +   Authorization: Bearer <cookie>
         ▼
Next.js proxy route
         │  fetch upstream, manual-follow 307
         ▼
FastAPI backend (NEXT_PUBLIC_API_URL)
  ├── /auth/login, /auth/register, /auth/me
  ├── /admin/users, /admin/devices, /admin/activity-logs
  └── /telemetry, /control
```

## 3. Directory Map

```
src/
├── app/                       Route segments (App Router)
│   ├── layout.tsx             root providers
│   ├── page.tsx               login screen (public)
│   ├── providers.tsx          QueryClientProvider, Toaster
│   ├── api/proxy/[...path]/   catch-all HTTP proxy → FastAPI
│   └── dashboard/
│       ├── layout.tsx         server-side auth gate + sidebar shell
│       ├── page.tsx           dashboard landing
│       ├── device-management/
│       ├── user-management/
│       ├── user-activity/     superuser-only
│       └── profile/
├── view/dashboard/*           page-level feature components (presentational + orchestrators)
├── components/
│   ├── app-sidebar.tsx        role-aware nav
│   ├── nav-user.tsx           user dropdown (Profile / Logout)
│   ├── login-page.tsx         login form (RHF + Zod)
│   └── ui/                    shadcn primitives
├── hooks/                     React Query wrappers (use-device, use-users)
├── services/                  axios call sites (auth, admin, device, activity, telemetry, control)
├── schemas/                   Zod validators (device, user)
├── stores/auth-store.ts       Zustand user + cookie helpers
├── lib/
│   ├── api.ts                 axios instance + interceptors
│   ├── server-auth.ts         server-only: cookie → /auth/me
│   └── utils.ts               cn(), helpers
├── middleware.ts              edge redirect rules
└── types/                     shared TS types (UserResponse, Role, etc.)
```

## 4. Authentication Flow

### 4.1 Login

```
[Login form] → POST /api/proxy/auth/login
                    ↓
            FastAPI returns { access_token }
                    ↓
          setAuthToken(token)           // document.cookie, SameSite=Lax, 7d
          useAuthStore.setUser(user)    // client snapshot
                    ↓
            router.push("/dashboard")
```

### 4.2 Per-request auth (client)

`lib/api.ts` axios instance:
- request interceptor: reads `auth-token` cookie, sets `Authorization: Bearer <token>`
- response interceptor: on 401 → `useAuthStore.logout()` + hard-redirect to `/`

### 4.3 Server-rendered pages

`lib/server-auth.ts` `getServerUser()`:
- reads `auth-token` from `next/headers` cookies
- fetches `{API}/auth/me` directly (bypasses proxy, `cache: "no-store"`)
- returns `UserResponse | null`

Used by `app/dashboard/layout.tsx`:
```
user = await getServerUser()
if (!user)             redirect("/")
if (user.role === USER) redirect("/")     // role=user blocked from dashboard
```

`user-activity/layout` (or page) further redirects `admin` → `/dashboard` (superuser only).

### 4.4 Middleware (edge)

`middleware.ts` runs before any render:
- `/` or `/register` with cookie → redirect to `/dashboard`
- `/dashboard/*` without cookie → redirect to `/?from=<path>`

Belt-and-suspenders with the server layout check; middleware is cheap (cookie presence only, no JWT verification).

### 4.5 Logout

`NavUser` dropdown → `useAuthStore.logout()` → `clearAuthToken()` + `setUser(null)` → `router.push("/")`.

## 5. API Proxy (`/api/proxy/[...path]`)

Solves three problems:

1. **Same-origin cookies** — browser never talks to FastAPI directly.
2. **307/308 trailing-slash redirects** — `fetch` with `redirect: "manual"` and one manual re-fetch preserve `Authorization`.
3. **Encoding hygiene** — strips `accept-encoding` upstream and `content-encoding`/`transfer-encoding`/`content-length` downstream to avoid body/length mismatch when Next re-encodes.

Supports GET, POST, PUT, PATCH, DELETE. Body forwarded as `arrayBuffer` for non-GET/HEAD.

## 6. Data Layer

```
Component
  │ useQuery / useMutation (hooks/)
  ▼
Service (services/*)   ← pure axios call, types only
  │
  ▼
axios (lib/api.ts)     ← injects Bearer + handles 401
  │
  ▼
/api/proxy/* route     ← forwards to FastAPI
```

- **Queries:** keyed by resource + filters (e.g. `["devices", { status }]`); invalidated on mutation success.
- **Mutations:** `onSuccess` → `queryClient.invalidateQueries` for affected keys → refetch.
- **Forms:** React Hook Form with Zod resolver; `schemas/*.ts` is single source of truth for shape + validation.

## 7. Authorization Matrix

| Route                              | Guest      | user     | admin    | superuser |
|------------------------------------|-----------|----------|----------|-----------|
| `/`                                | allow     | redirect | redirect | redirect  |
| `/register`                        | allow     | redirect | redirect | redirect  |
| `/dashboard`                       | → `/`     | → `/`    | allow    | allow     |
| `/dashboard/device-management`     | → `/`     | → `/`    | allow    | allow     |
| `/dashboard/user-management`       | → `/`     | → `/`    | allow    | allow     |
| `/dashboard/user-activity`         | → `/`     | → `/`    | → `/dashboard` | allow |
| `/dashboard/profile`               | → `/`     | → `/`    | allow    | allow     |

Enforced at three layers: middleware (cookie), server layout (`getServerUser` + role), UI (sidebar hides items admin can't use).

## 8. State Model

- **Server truth:** `getServerUser()` on every navigation to `/dashboard/*`.
- **Client snapshot:** `useAuthStore` (Zustand + `persist`) — holds `user` for NavUser/avatar. Rehydrated from `localStorage`; cookie is the real credential.
- **Cache:** TanStack Query — per-resource; TTL default; invalidated on mutation.

Client store and server truth can diverge briefly (e.g. after profile edit). Mutations call `setUser` so the sidebar updates immediately; server re-reads on next nav.

## 9. Key Components

- `AppSidebar` — receives `initialUser` from server layout → renders role-filtered nav without hydration flicker.
- `NavUser` — avatar dropdown; Profile + Logout only (no settings/notifications).
- `LoginPage` — RHF + Zod, calls `auth-service.login`, stores token, pushes dashboard.
- `DeviceCard` / device list — grid/list toggle, pump-status filter, QR dialog, CRUD via `use-device` hook.
- `ActivityView` — superuser-only; category filter, stat cards, 24h trend chart, paginated table.

## 10. Environment

```
NEXT_PUBLIC_API_URL=https://epump-api.projekbareng.web.id   # FastAPI base URL
```

Build: `bun run build`. Dev: `bun run dev`. E2E: `bun run e2e` (see `e2e/README.md`).

## 11. Testing

- **UAT (manual):** `src/test-case/UAT_TestCase_IoT_Dashboard.xlsx` — 8 modules, dropdown status, auto-aggregated summary.
- **E2E (Playwright):** `e2e/` — one spec per UAT module, test titles carry UAT IDs (`TC-AUTH-001`, ...). Playwright config loads `.env.e2e` and auto-starts `bun run dev`.

## 12. Request Sequence — "Edit a device"

```
User clicks Edit
  → EditDialog opens (RHF, defaults from row)
  → Submit → useUpdateDevice mutation
      → axios PUT /api/proxy/admin/devices/{id}
          → proxy fetch → FastAPI
            (307 on missing slash → retry with slash, headers intact)
          ← 200 JSON
      ← onSuccess: queryClient.invalidateQueries(["devices"])
  → Device list refetches → UI reflects new state
  → Toast "Device updated"
```

## 13. Failure Modes

| Failure                         | Where caught                         | Behavior                           |
|---------------------------------|--------------------------------------|------------------------------------|
| Expired / invalid token         | axios response interceptor (401)     | clear cookie + redirect `/`        |
| Missing cookie on `/dashboard`  | middleware + server layout           | redirect `/?from=<path>`           |
| Role mismatch (user on dash)    | server layout                        | redirect `/`                       |
| Backend 5xx                     | React Query `onError` / service      | toast + keep UI state              |
| Network / CORS                  | N/A (proxy is same-origin)           | axios rejects → toast              |
| FastAPI trailing-slash 307      | proxy route                          | one manual redirect follow         |
| Duplicate email on register/edit| backend 4xx → service                | surface message inline + toast     |

## 14. Conventions

- **Server components by default**; `"use client"` only where interactivity required.
- **Services never throw on auth** — 401 handled centrally in axios.
- **Zod schemas live beside the form** that uses them (`schemas/*.ts`), re-used in mutations.
- **`getServerUser` never talks through the proxy** — it calls FastAPI directly (server-to-server, no cookie round-trip).
- **All mutations invalidate their read keys** — no manual cache writes.

## 15. File Index

| Concern              | File                                           |
|----------------------|------------------------------------------------|
| Edge auth redirect   | `src/middleware.ts`                            |
| Server auth resolve  | `src/lib/server-auth.ts`                       |
| Client token cookie  | `src/stores/auth-store.ts`                     |
| Axios + interceptors | `src/lib/api.ts`                               |
| Backend proxy        | `src/app/api/proxy/[...path]/route.ts`         |
| Dashboard gate       | `src/app/dashboard/layout.tsx`                 |
| Role-aware sidebar   | `src/components/app-sidebar.tsx`               |
| Login form           | `src/components/login-page.tsx`                |
| Feature views        | `src/view/dashboard/*`                         |
| API call sites       | `src/services/*.ts`                            |
| Query hooks          | `src/hooks/use-*.ts`                           |
| Form schemas         | `src/schemas/*.ts`                             |
| UAT spec             | `src/test-case/UAT_TestCase_IoT_Dashboard.xlsx`|
| E2E tests            | `e2e/`                                         |

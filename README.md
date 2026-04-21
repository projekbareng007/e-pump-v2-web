# EPump — IoT Dashboard

A modern IoT device management dashboard for the Smart E-Pump system. Built with Next.js, designed around the **"Fluid Architect"** philosophy — transforming complex IoT data into a clean, editorial experience with atmospheric depth and sophisticated UI.

---

## Features

- **Authentication** — Secure login and registration with JWT-based session management
- **Dashboard Overview** — Real-time stats: total users, devices, active/inactive pumps with live polling
- **Device Management** — Full CRUD for IoT pump devices, QR code generation for Scan-to-Claim
- **User Management** — Admin-level user administration with role-based access control
- **User Activity Tracking** — Paginated audit trail with category filtering (Device, Control, Administrative)
- **Activity Trend Chart** — 24-hour activity visualization bucketed per 4-hour windows
- **Profile Management** — Users can view and update their own account info
- **API Proxy** — Dynamic server-side proxy route for seamless backend communication
- **Paginated API** — All list endpoints support server-side pagination (`page` / `page_size`)
- **Responsive Layout** — Mobile-aware sidebar navigation and adaptive layouts
- **Per-page Metadata** — SEO-friendly title and description on every route
- **Custom Favicon** — Wave logo served as `favicon.ico` from the app directory

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| State Management | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Forms & Validation | React Hook Form + Zod |
| HTTP Client | Axios |
| Auth | JWT (jwt-decode) |
| Linting/Formatting | Biome |
| Runtime | Bun |

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- Access to the Smart E-Pump backend API

### Installation

```bash
git clone <repository-url>
cd iot-dashboard-v2

bun install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
bun run build
bun run start
```

### Code Quality

```bash
bun run lint
bun run format
```

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Login page
│   ├── register/               # Register page
│   ├── dashboard/              # Protected dashboard routes
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── device-management/  # Device CRUD
│   │   ├── user-management/    # User CRUD
│   │   ├── user-activity/      # Activity logs (superuser only)
│   │   └── profile/            # User profile
│   └── api/proxy/[...path]/    # Server-side API proxy
├── components/                 # Shared UI components
├── view/dashboard/             # Feature-specific view modules
│   ├── dashboard/              # Overview + stat cards
│   ├── device/                 # Device management views
│   ├── user/                   # User management views
│   ├── activity/               # Activity log + trend chart
│   └── profile/                # Profile view
├── hooks/                      # Custom React hooks (useDevices, useUsers)
├── services/                   # API service layer
├── stores/                     # Zustand auth store
├── schemas/                    # Zod validation schemas
├── types/                      # TypeScript type definitions
├── lib/                        # Utility functions + server auth
└── middleware.ts               # Auth & route protection middleware
```

---

## API Integration

Connects to the **Smart E-Pump REST API**. Full API spec at [`src/documentation/API_DOCUMENTATION.md`](./src/documentation/API_DOCUMENTATION.md) and [`src/documentation/api.json`](./src/documentation/api.json).

### Key API Patterns

| Pattern | Detail |
|---|---|
| Auth | Bearer JWT in `Authorization` header |
| List endpoints | Paginated — returns `{ items, total, page, page_size, total_pages }` |
| Device fields | `device_id`, `owner_id`, `status_pompa`, `last_seen` |
| Telemetry | Sensor readings in `data` object (`{ flow_rate, pressure, ... }`) |
| Activity logs | `data` object with activity details, categories: `device` / `control` / `administrative` |
| Control command | `{ action: "on" \| "off" }` |

### Enums

| Enum | Values |
|---|---|
| `UserFilter` | `include_admin`, `user_only` |
| `DeviceFilter` | `all`, `registered`, `unregistered` |
| `ActivityCategory` | `device`, `control`, `administrative` |
| `PumpAction` | `on`, `off` |

---

## Design System

Documented in [`DESIGN.md`](./DESIGN.md).

- **Color** — Deep Ocean Blue `#003D7C` (primary), Teal `#006A6A` (online), Burnt Sienna `#6A2B00` (warning)
- **Typography** — Manrope (Bold) for headings, Inter for body and data
- **Shadows** — Floating elements: 32px blur at 6% opacity
- **Tonal Layering** — Depth via background shifts, not explicit borders

---

## Authentication Flow

1. Login via `/` or register via `/register`
2. JWT stored and decoded client-side via `jwt-decode`
3. `middleware.ts` guards all `/dashboard/*` routes — unauthenticated → redirect to `/`
4. API calls proxied through `/api/proxy/[...path]` with auth token attached
5. Role-based access: `user-activity` page restricted to `superuser` role

---

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server on port 3000 |
| `bun run build` | Create production build |
| `bun run start` | Run production server |
| `bun run lint` | Run Biome linter |
| `bun run format` | Run Biome formatter |

---

## License

This project is private. All rights reserved.

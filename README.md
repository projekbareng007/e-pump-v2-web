# IoT Dashboard v2

A modern, high-end IoT device management dashboard built with Next.js. Designed around the **"Fluid Architect"** philosophy — transforming complex IoT data into a clean, editorial experience with atmospheric depth and sophisticated UI.

---

## Features

- **Authentication** — Secure login and registration with JWT-based session management
- **Device Management** — Full CRUD operations for IoT devices
- **User Management** — Admin-level user administration panel
- **User Activity Tracking** — Monitor and audit user activity across the system
- **API Proxy** — Dynamic server-side proxy route for seamless backend communication
- **Responsive Layout** — Mobile-aware sidebar navigation and adaptive layouts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Base UI |
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
- Access to the backend API

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd iot-dashboard-v2

# Install dependencies
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
# Lint
bun run lint

# Format
bun run format
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (login, register)
│   ├── dashboard/          # Protected dashboard routes
│   │   ├── device/         # Device management pages
│   │   ├── user/           # User management pages
│   │   └── activity/       # Activity tracking pages
│   └── api/proxy/          # Server-side API proxy
├── components/             # Shared UI components (shadcn-based)
├── view/dashboard/         # Feature-specific view modules
│   ├── device/
│   ├── user/
│   └── activity/
├── stores/                 # Zustand state stores (auth)
├── schemas/                # Zod validation schemas
├── hooks/                  # Custom React hooks
├── services/               # API service layer
├── types/                  # TypeScript type definitions
├── lib/                    # Utility functions
└── middleware.ts           # Auth & route protection middleware
```

---

## Design System

This project follows a custom design system documented in [`DESIGN.md`](./DESIGN.md).

**Key design principles:**

- **Color Palette** — Deep Ocean Blue (`#003D7C`) as primary, Teal Vitality (`#006A6A`) for success/online states, Burnt Sienna (`#6A2B00`) for warnings
- **Typography** — Manrope (Bold) for headlines, Inter for body and data labels
- **Glassmorphism** — Navigation and floating elements use 80% opacity with 24px backdrop-blur
- **Tonal Layering** — Depth through background shifts, not borders — no explicit 1px dividers
- **Ambient Shadows** — Floating elements use 32px blur at 6% opacity

---

## Authentication Flow

1. User logs in via `/login` or registers via `/register`
2. JWT token is stored and decoded client-side via `jwt-decode`
3. `middleware.ts` guards all `/dashboard/*` routes — unauthenticated requests are redirected to `/login`
4. API calls are proxied through `/api/proxy/[...path]` with the auth token attached

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

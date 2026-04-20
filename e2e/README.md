# E2E Testing — IoT Dashboard v2

Playwright end-to-end tests aligned with `src/test-case/UAT_TestCase_IoT_Dashboard.xlsx`.

## Structure

```
e2e/
├── fixtures/          Auth fixtures and test accounts
│   └── accounts.ts    Superuser / admin / user credentials (env-backed)
├── pages/             Page Object Models
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   ├── device.page.ts
│   ├── user.page.ts
│   ├── activity.page.ts
│   └── profile.page.ts
├── tests/             Test specs, one per UAT module
│   ├── auth.spec.ts          → TC_Authentication
│   ├── dashboard.spec.ts     → TC_Dashboard
│   ├── device-mgmt.spec.ts   → TC_Device_Mgmt
│   ├── user-mgmt.spec.ts     → TC_User_Mgmt
│   ├── activity.spec.ts      → TC_Activity
│   ├── profile.spec.ts       → TC_Profile
│   ├── navigation.spec.ts    → TC_Navigation
│   └── api.spec.ts           → TC_API
├── utils/
│   └── test-ids.ts    Central list of UAT test case IDs
├── report/            HTML report (gitignored)
└── test-results/      Traces, screenshots, videos (gitignored)
```

## Setup

```bash
bun add -D @playwright/test
bunx playwright install chromium
```

## Configure accounts

Create `.env.e2e` (gitignored) or export these vars before running:

```
E2E_BASE_URL=http://localhost:3000
E2E_SUPERUSER_EMAIL=superuser@example.com
E2E_SUPERUSER_PASSWORD=...
E2E_ADMIN_EMAIL=admin@example.com
E2E_ADMIN_PASSWORD=...
E2E_USER_EMAIL=user@example.com
E2E_USER_PASSWORD=...
```

## Run

```bash
bunx playwright test                       # all tests
bunx playwright test e2e/tests/auth.spec.ts
bunx playwright test --ui                  # interactive
bunx playwright show-report e2e/report     # open last report
```

## Mapping to UAT

Each `test()` title includes the UAT test-case ID (e.g. `TC-AUTH-001`) so results
can be traced back to the spreadsheet.

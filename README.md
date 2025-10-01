## Project Status (MVP – WIP)

This repository is a work-in-progress. Current scope focuses on wiring the
multi-tenant settings (Appearance) end-to-end and basic authentication.

### What works today
- **Login (seeded account only)** using JWT.
- **Protected routes** are in place for the private area.
- **Fetch tenant settings** (`GET /tenants/:tenantId/settings`).
- **Update Appearance → Primary color** (`PATCH /tenants/:tenantId/settings/appearance`)  
  - Primary color is persisted in the backend and applied to the UI theme.

### Demo login (seed data)
> **For local development only. Do NOT use in production.**

- Email: `owner@alpha.coffee`  
- Password: `password`

### Quick smoke test
1. Run backend and frontend locally.
2. Login with the seeded account above.
3. Go to **Settings → Appearance**.
4. Change **Primary color** and hit **Save**.
5. The UI should re-theme using your selected primary color.

### Known limitations
- **Only primary color and accent color** is applied from Appearance today; **accent color** and other
  appearance options are not yet wired to the live theme.
- **Single account** login only (via DB seed). No registration or multi-user setup yet.
- Other settings tabs (Localization, Domain, Logo upload, etc.) are not fully wired.
- Multi-tenant UX (auto-assume vs. select tenant) is still in progress.

### Next steps (planned)
- Hook up **Localization / Domain / Logo upload** mutations and cache invalidation.
- Tenant selection flow (auto-assume single tenant, selection page for multi-tenant).
- Capability prefetch (guard the UI based on role/permissions).
- Error mapping (401/403/422/500) and UX polish for retries.

### Frontend Setup

## Environment
```
VITE_API_BASE_URL=http://localhost:4000
```
## Install & Run
```
pnpm install
pnpm dev
```

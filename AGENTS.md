# AGENTS.md — Ceres

**Stack**: .NET 10 + EF Core (Code-First) + Npgsql + PostgreSQL | React 19 + TS 6 + Vite 8 + Tailwind v4
**Auth**: JWT (access, 15min expiry) + bcrypt. Refresh/logout not implemented yet.
**Tracking**: Linear project **Ceres** (IDs: MID-XX). Notion docs linked below.

## Current State

**Only Identity/Auth is implemented.** Gym domain entities dirs are empty; no Finance code exists yet.
**Current sprint**: Sprint 2 — Autenticación (MID-48 FE login in progress, MID-46 BE login done).

| What | Exists? |
|------|---------|
| User entity, auth endpoints, JWT, bcrypt | ✅ |
| EF Core migrations (User only) | ✅ |
| Gym/Finance domains | ❌ |
| Frontend src/modules/ | ❌ |
| Tests (any layer) | ❌ |
| CI/CD, editorconfig | ❌ |

## Commands

```bash
# Backend (from backend/)
dotnet build ceres.sln
dotnet watch --project ceres.api/ceres.api.csproj
docker compose -f ceres.api/docker-compose.yml up -d

# EF migrations (from ceres.api/)
dotnet ef migrations add <Name> --project ../ceres.infrastructure --startup-project .
dotnet ef database update --project ../ceres.infrastructure --startup-project .

# Frontend (from frontend/)
pnpm dev       # port 5173, proxies /api → localhost:5170
pnpm build     # tsc -b && vite build
pnpm lint      # oxlint, no type-aware rules
```

## Architecture

Backend: `API → Application → Domain`; `Infrastructure → Domain`
**Known debt**: `ceres.application.csproj` references `ceres.infrastructure` (shouldn't in Clean Architecture).
**Known debt**: `IUserRepository` interface is in `Infrastructure/Repositories/Identity/`, should be in Application as a port.

## Gotchas

- **CORS**: `Cors:AllowedOrigins` must be set or app throws on startup. Default: `["http://localhost:5173"]`
- **DB**: `Host=localhost;Port=5432;Database=ceres_db;Username=ceres_user;Password=ceres_pass`
- **EF schemas**: User table lives in `identity` schema via `UserConfiguration`
- **JWT secret** in `appsettings.Development.json` (gitignored). Expiry: 15min
- **Mappers**: manual extension methods (`ToEntity()`, `ToResponse()`) — no AutoMapper
- **API**: Minimal APIs with `MapGroup("/api")` + extension methods
- **OpenAPI/Scalar** dev-only: `app.MapOpenApiDocumentation()` at `/scalar/v1`
- **Global exception handler** only handles `BadHttpRequestException` (400); unhandled exceptions return 500
- **Frontend**: `verbatimModuleSyntax` in TS — must use `import type` for type-only imports
- **No test projects** exist; no CI pipeline configured

## Notion Docs

- SDD: `https://app.notion.com/p/394400927746817f85dcc1e2dd5cb401`
- Gym module: `https://app.notion.com/p/39440092774680fc865be8b024c5d007`
- Mappers guide: `https://app.notion.com/p/3944009277468123bb56f9fa19cda62d`

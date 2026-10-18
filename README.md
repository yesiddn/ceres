# Ceres

Personal finance app with a gym tracking module — built to learn and apply real architecture, backend, frontend, and database fundamentals.

**License**: GPLv3

> Project context, current implementation status, and working conventions are maintained in [`AGENTS.md`](AGENTS.md). Notion documents project requirements and technical decisions; Linear manages issues and cycles; the repository is the source of truth for implemented behavior.

---

## Tech Stack

| Layer | Tech |
|------|------|
| Backend | .NET 10 Minimal APIs |
| ORM | EF Core 10 (Code-First) |
| Database | PostgreSQL via Npgsql |
| Auth | JWT (Bearer) + BCrypt; refresh-token rotation |
| Frontend | React 19 + TypeScript 6 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Linting | Oxlint |
| Containers | Docker Compose |

---

## Quick Start

```bash
# 1. Start PostgreSQL
docker compose -f backend/ceres.api/docker-compose.yml up -d

# 2. Run backend (hot reload)
dotnet watch --project backend/ceres.api/ceres.api.csproj

# 3. Run frontend
pnpm --dir frontend dev
```

- API: `http://localhost:5170`, Scalar at `/scalar/v1`
- Frontend: `http://localhost:5173`

See [`AGENTS.md`](AGENTS.md) for additional build, lint, migration commands and local configuration notes.

---

## Architecture

Backend follows Clean Architecture: `API → Application → Domain`; `Infrastructure → Application + Domain`.

Frontend is organized by domain/feature under `frontend/src/modules`, with shared API infrastructure under `frontend/src/shared` and application routing/layout under `frontend/src/app`.

---

## Project Structure

```
ceres/
├── backend/
│   ├── ceres.api/              # Minimal API, endpoints, DI, middleware
│   ├── ceres.application/      # Use cases, DTOs, services, ports and mappers
│   ├── ceres.domain/           # Entities and domain rules
│   └── ceres.infrastructure/   # EF Core, PostgreSQL, repositories, migrations
├── frontend/
│   └── src/
│       ├── app/                # Routing, layouts, guards and providers
│       ├── modules/            # Feature modules (auth, gym, ...)
│       └── shared/             # Shared API client and UI
├── AGENTS.md                  # Project context, canonical docs and agent guidance
└── README.md
```

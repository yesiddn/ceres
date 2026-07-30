# Ceres

Personal finance app with gym tracking module — built to learn and apply real architecture, backend, frontend, and database fundamentals.

**License**: GPLv3

---

## Current Sprint: Sprint 2 — Authentication (Login & Registration)

We're implementing JWT-based authentication.

| Issue | Status |
|-------|--------|
| MID-46 — BE Login + JWT | ✅ Done |
| MID-45 — BE Register + bcrypt | ✅ Done |
| MID-44 — User entity + migrations | ✅ Done |
| MID-48 — FE Login view | 🔄 In Progress |
| MID-47 — FE Register view | ⏳ Todo |
| MID-75 — BE Refresh Token | ⏳ Todo |
| MID-49 — Global auth state (FE) | 📋 Backlog |
| MID-50 — Axios interceptor (FE) | 📋 Backlog |

**Sprint progress**: 41% (via Linear)

---

## What Exists vs What's Planned

| Layer | Implemented | Planned |
|-------|-------------|---------|
| **Backend** | User entity, AppDbContext, auth (register + login), JWT, bcrypt, EF migrations, health check | Accounts, Categories, Transactions, Gym (exercises, routines, workouts) |
| **Frontend** | Vite + React skeleton, health check UI, generic API client | Login/Register pages, dashboard, finance CRUD, gym tracking UI |
| **Infra** | Docker Compose (PostgreSQL + pgAdmin) | CI/CD, tests |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | .NET 10 Minimal APIs |
| ORM | EF Core 10 (Code-First) |
| Database | PostgreSQL 17 via Npgsql |
| Auth | JWT (Bearer) + BCrypt |
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

---

## Architecture

Backend follows Clean Architecture layers: `API → Application → Domain`; `Infrastructure → Domain`.

Frontend is organized by domain (Screaming Architecture): `modules/<domain>/<subdomain>/{components,pages,hooks,services,types,utils}`.

**Known debt**: `ceres.Application` references `ceres.Infrastructure` (should not in Clean Architecture). `IUserRepository` lives in Infrastructure instead of Application.

---

## Project Structure

```
ceres/
├── backend/
│   ├── ceres.api/              # Minimal API, endpoints, DI, middleware
│   ├── ceres.application/      # Use cases, DTOs, services, mappers
│   ├── ceres.domain/           # Entities, value objects
│   └── ceres.infrastructure/   # EF Core, PostgreSQL, repositories, migrations
├── frontend/
│   ├── src/
│   │   ├── api/                # API client
│   │   └── App.tsx             # Health check demo
│   └── package.json
└── AGENTS.md
```

---

## Documentation

- **SDD**: [Notion — Software Design Document](https://app.notion.com/p/394400927746817f85dcc1e2dd5cb401)
- **Gym Module**: [Notion — Módulo de Gimnasio](https://app.notion.com/p/39440092774680fc865be8b024c5d007)
- **Mappers**: [Notion — DTOs, Entidades y Mappers](https://app.notion.com/p/3944009277468123bb56f9fa19cda62d)
- **Tracking**: [Linear — Ceres Project](https://linear.app/midnight-snow/project/ceres-864218283604)

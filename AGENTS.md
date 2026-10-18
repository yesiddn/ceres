# AGENTS.md — Ceres

## Fuente de contexto y responsabilidades

**Todo el contexto del proyecto vive en tres lugares que se deben consultar y contrastar:**

- **Notion** es la fuente para documentar el proyecto: requisitos, especificaciones, arquitectura/decisiones, guías técnicas, progreso e historial de aprendizajes.
- **Linear** es la fuente para gestionar el trabajo: issues, estados, ciclos, prioridades y alcance planificado. No asumir que el plan histórico de Notion sigue siendo el estado actual de las tareas.
- **El código** es la fuente de verdad de lo que está implementado actualmente. Verificarlo antes de describir capacidades o deuda técnica.

Antes de planear o implementar cambios relevantes, revisar las páginas de Notion pertinentes, el proyecto/issues/cycle correspondiente de Linear y el estado real del repositorio. Si las fuentes difieren, priorizar el código para capacidades presentes, Linear para el estado de trabajo y Notion para intención/decisiones documentadas; señalar discrepancias relevantes y no inventar un estado reconciliado.

## Proyecto y estado observado

Ceres es una aplicación de finanzas personales con seguimiento de gimnasio. Stack observado: **.NET 10, EF Core Code-First, Npgsql/PostgreSQL; React 19, TypeScript 6, Vite 8 y Tailwind CSS v4**.

El código ya va más allá de Identity/Auth: backend y frontend incluyen el módulo Gym para Exercises y Routines. Finance todavía no está implementado. La UI de Gym tiene CRUD de ejercicios; las vistas de rutinas aún están por construir (en el snapshot, existe una página placeholder y contratos/servicios).

### Situación de trabajo (consultada el 2026-10-17)

- Linear: proyecto **Ceres**, estado **In Progress**; link: [Linear — Ceres](https://linear.app/midnight-snow/project/ceres-864218283604).
- El ciclo actual es **Cycle 4**, del 17 al 31 de octubre de 2026.
- **Cycle 3**: MID-89 y MID-90 completadas (8/13 puntos). MID-91 y MID-92 se encuentran ahora en Cycle 4 según el registro de issues vigente.
- **Cycle 4** tiene actualmente MID-91, MID-92, MID-93, MID-94, MID-95 y MID-96; todas aparecen Todo en la consulta realizada. Total: 18 puntos. La secuencia general es listar rutinas, formulario de metadatos, selección/configuración de ejercicios, persistencia del agregado y verificación end-to-end. Comprobar Linear de nuevo al comenzar trabajo: ciclo y estados pueden cambiar.
- MID-90 (CRUD de Exercise) está Done; la nota de avance Notion del 2026-10-16 registra integración a `main` por PR #72.
- Los milestones de Sprint 1, 2 y 3 están completos; el trabajo funcional actual es GT-3 (UI de Exercise/Routine), no Sprint 2 de autenticación.

### Estado del código

| Área | Estado verificado |
|---|---|
| Identity/Auth backend | User, registro/login, JWT, bcrypt, refresh token opaco con almacenamiento hash, refresh/rotación y logout/revocación |
| Identity/Auth frontend | Login/registro, estado de sesión, renovación, coordinación de sesión y protección de rutas |
| Gym backend | Entidades Exercise/Routine/RoutineExercise; persistencia, migración y endpoints autenticados CRUD para Exercise y Routine |
| Gym frontend | Catálogo y CRUD de Exercises, servicios tipados; rutinas aún no implementadas completamente en UI |
| Finance | No implementado |
| Tests | No se encontraron proyectos de pruebas en el estado inspeccionado; verificar antes de nuevas afirmaciones |
| CI/CD | Frontend CI aparece mencionado como exitoso en Notion; comprobar workflows y estado actual antes de afirmar cobertura completa |

## Documentación canónica (Notion)

- [Software Design Document (SDD)](https://app.notion.com/p/394400927746817f85dcc1e2dd5cb401)
- [Módulo de Gimnasio (Gym Tracking)](https://app.notion.com/p/39440092774680fc865be8b024c5d007)
- [DTOs, Entidades y Mappers](https://app.notion.com/p/3944009277468123bb56f9fa19cda62d)
- [Guía de desarrollo y decisiones](https://app.notion.com/p/3c540092774681cc85e0e41e59e453fb)
- [Avance del proyecto](https://app.notion.com/p/3af40092774681079fcfe44b08d4594e)
- [Arquitectura y dependencias](https://app.notion.com/p/3c5400927746812bbe4dd8ff3dee256d)
- [Frontend y organización React](https://app.notion.com/p/3c540092774681149390d8e44454a732)

Consultar las páginas específicas del dominio antes de cambiar contratos o reglas. Las páginas de avance son históricas: su última actualización puede quedar obsoleta; contrastar siempre con Linear y código.

## Comandos

```bash
# Backend (desde backend/)
dotnet build ceres.sln
dotnet watch --project ceres.api/ceres.api.csproj
docker compose -f ceres.api/docker-compose.yml up -d

# EF migrations (desde backend/ceres.api/)
dotnet ef migrations add <Name> --project ../ceres.infrastructure --startup-project .
dotnet ef database update --project ../ceres.infrastructure --startup-project .

# Frontend (desde frontend/)
pnpm dev       # puerto 5173; proxy /api → localhost:5170
pnpm build     # tsc -b && vite build
pnpm lint      # oxlint
```

## Arquitectura y convenciones

- Backend: `API → Application → Domain`; `Infrastructure → Application + Domain`. Application define puertos/interfaces; Infrastructure contiene implementaciones EF Core/repositorios.
- API en Minimal APIs, route group `/api`, endpoints organizados por dominio. Scalar/OpenAPI es de desarrollo.
- Mapeo manual con extensiones (`ToEntity()`, `ToResponse()`); no añadir AutoMapper sin decisión explícita.
- EF Core Code-First; configuraciones Fluent API en Infrastructure. Identity usa schema `identity`; Gym usa schema `gym`.
- Gym sigue `Endpoints → Services → Repositories`. El ownership del usuario autenticado se obtiene del token y se filtra en repositorios; nunca confiar en `UserId` del payload.
- Frontend por features en `src/modules/<domain>/...`; reutilizar `shared/services/api/apiClient.ts`.
- Las páginas de datos usan React Router loaders → service de feature → `apiClient`; propagar `request.signal`. Para carga diferida usar `Suspense`/`Await` y skeletons según patrón existente. Consultar la guía canónica de frontend en Notion antes de cambiar el patrón.
- La sesión se centraliza en `authRuntime`; middleware inicializa/protege antes de loaders y Axios usa el token de la misma fuente. No crear otra fuente global ni otro cliente HTTP sin justificación.
- TypeScript usa `verbatimModuleSyntax`: imports de tipos con `import type`.

## Configuración y gotchas

- CORS requiere `Cors:AllowedOrigins`; valor local esperado `http://localhost:5173`.
- PostgreSQL local documentado: `Host=localhost;Port=5432;Database=ceres_db;Username=ceres_user;Password=ceres_pass`.
- Secretos JWT/configuración sensible van en configuración local/variables de entorno y no deben commitearse. `appsettings.Development.json` está gitignored.
- Refresh token: cookie `HttpOnly`; la base almacena hash, no token en claro. No persistir tokens en `localStorage`/`sessionStorage`.
- Excepciones globales: verificar `GlobalExceptionHandler` antes de asumir cobertura; no tratar errores inesperados como si ya tuvieran respuesta uniforme.
- Validar las rutas reales y nombres de archivos antes de editar: algunos nombres históricos no siguen PascalCase.

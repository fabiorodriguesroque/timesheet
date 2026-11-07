# Timesheet

Monorepo for the Timesheet app, managed with [Turborepo](https://turborepo.dev) and [Bun](https://bun.sh).

## Structure

```
timesheet/
├── apps/
│   ├── api/                  # @repo/api — HTTP API (Hono + Bun)
│   │   ├── drizzle/          # Generated SQL migrations (drizzle-kit)
│   │   ├── drizzle.config.ts # drizzle-kit config (reads src/db/schema.ts)
│   │   └── src/
│   │       ├── index.ts      # Server entry point (port 3001)
│   │       ├── db/
│   │       │   ├── index.ts        # Drizzle client (`db`)
│   │       │   ├── schema.ts       # All tables — source for migrations
│   │       │   ├── auth-schema.ts  # Better Auth tables (generated, do not edit)
│   │       │   ├── relations.ts    # Drizzle relations (app + auth)
│   │       │   └── reset.ts        # Local database reset script
│   │       └── lib/
│   │           └── auth.ts   # Better Auth config
│   └── web/                  # @repo/web — Frontend (TanStack Start + React + Tailwind)
│       └── src/
│           ├── routes/       # File-based routes
│           └── router.tsx
├── packages/
│   ├── oxlint-config/        # @repo/oxlint-config — shared Oxlint rules
│   └── typescript-config/    # @repo/typescript-config — shared tsconfig bases
├── compose.yaml              # Local Postgres (Docker)
└── turbo.json                # Turborepo task pipeline
```

### Tech stack

| Area    | Tools                                                |
| ------- | ---------------------------------------------------- |
| Runtime | Bun, TypeScript 7                                    |
| API     | Hono, Drizzle ORM (v1), Postgres, Better Auth        |
| Web     | TanStack Start, TanStack Router, React, Tailwind CSS |
| Tooling | Turborepo, Oxlint, Prettier, Docker Compose          |

## Getting started

Requirements: Bun `1.3.14`, Node `>=24`, Docker.

```sh
bun install
bun run docker:up                         # start Postgres on localhost:5433
cp apps/api/.env.example apps/api/.env    # then fill in the values below
bun run db:migrate                        # create the tables
bun run dev                               # start api (3001) and web (3000)
```

### Environment variables (`apps/api/.env`)

| Variable             | Description                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`       | Postgres connection string. Local default: `postgresql://timesheet:timesheet@localhost:5433/timesheet` |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth to sign sessions. Generate with `openssl rand -base64 32`                   |

The Postgres container can be customised with `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` and `POSTGRES_PORT` (defaults: `timesheet` / `timesheet` / `timesheet` / `5433`).

## Commands

All commands run from the repository root.

### General

| Command               | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `bun run dev`         | Start every app in development mode (api with hot reload, web on Vite) |
| `bun run build`       | Build every app for production                                         |
| `bun run lint`        | Lint every package with Oxlint (type-aware)                            |
| `bun run check-types` | Type-check every package with `tsc --noEmit`                           |
| `bun run format`      | Format all `.ts`, `.tsx` and `.md` files with Prettier                 |

### Docker

| Command               | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `bun run docker:up`   | Start the Postgres container and wait until it is healthy           |
| `bun run docker:down` | Stop and remove the Postgres container (data is kept in the volume) |

### Database

| Command               | Description                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `bun run db:generate` | Create a new SQL migration in `apps/api/drizzle/` from changes in `src/db/schema.ts`             |
| `bun run db:migrate`  | Apply pending migrations to the database                                                         |
| `bun run db:reset`    | **Destructive.** Drop all tables and re-apply every migration. Refuses to run on non-local hosts |

### Per app

Run any app script directly with `bun run --cwd <app> <script>`, or limit a Turbo task with `--filter`, e.g. `bun run dev --filter=@repo/web`.

| App        | Script    | Description                                |
| ---------- | --------- | ------------------------------------------ |
| `apps/api` | `dev`     | Start the API with hot reload on port 3001 |
| `apps/web` | `dev`     | Start the Vite dev server on port 3000     |
| `apps/web` | `build`   | Build the web app for production           |
| `apps/web` | `preview` | Preview the production build locally       |

## Workflows

### Changing the database schema

1. Add or edit tables in `apps/api/src/db/schema.ts` (and relations in `relations.ts`).
2. `bun run db:generate` — review the generated SQL in `apps/api/drizzle/`.
3. `bun run db:migrate`.

### Updating the Better Auth schema

After adding a Better Auth plugin or changing auth fields, regenerate the auth tables and create a migration:

```sh
cd apps/api
bunx auth@latest generate --config src/lib/auth.ts --output src/db/auth-schema.ts --yes
cd ../..
bun run db:generate && bun run db:migrate
```

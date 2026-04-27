# Project Context: itcamp-allcamp

## Project Overview
`itcamp-allcamp` is a modern full-stack TypeScript monorepo built using the [Better T Stack](https://www.better-t-stack.dev/). It leverages a high-performance architecture designed for type safety and developer efficiency.

### Core Tech Stack
- **Runtime:** [Bun](https://bun.sh/)
- **Monorepo Tooling:** [Turborepo](https://turbo.build/repo)
- **Frontend:** [TanStack Start](https://tanstack.com/router/v1/docs/guide/start) (SSR with TanStack Router)
- **Backend:** [ElysiaJS](https://elysiajs.com/) (High-performance web framework)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** SQLite / [Turso](https://turso.tech/) (via LibSQL)
- **Styling:** TailwindCSS with [shadcn/ui](https://ui.shadcn.com/)

## Project Structure
The project is organized into workspaces under `apps/` and `packages/`:

- **`apps/web`**: The TanStack Start frontend application.
- **`apps/server`**: The Elysia backend API.
- **`packages/ui`**: Shared UI component library (shadcn/ui primitives).
- **`packages/db`**: Database schema definitions and Drizzle client.
- **`packages/env`**: Centralized environment variable validation using Zod.
- **`packages/config`**: Shared configuration files (e.g., TypeScript base configs).

## Building and Running

### Prerequisites
- [Bun](https://bun.sh/) installed locally.

### Key Commands
| Command | Description |
| :--- | :--- |
| `bun install` | Install all dependencies across the monorepo. |
| `bun run dev` | Start all applications (web and server) in development mode. |
| `bun run build` | Build all packages and applications for production. |
| `bun run check-types` | Run type checking across the entire project. |
| `bun run db:push` | Push schema changes from `packages/db` to the database. |
| `bun run db:studio` | Open the Drizzle Studio UI to browse data. |
| `bun run dev:web` | Start only the frontend application. |
| `bun run dev:server` | Start only the backend API. |

## Development Conventions

### Environment Variables
Environment variables are validated using Zod in `packages/env`.
- Server-side envs: `packages/env/src/server.ts`
- Client-side envs: `packages/env/src/web.ts`
Always add new variables to these schemas to ensure type safety.

### UI Components
- Shared primitives live in `packages/ui/src/components`.
- Import them in applications using the workspace alias: `@itcamp-allcamp/ui/components/...`.
- Global styles and Tailwind configuration are managed within the `packages/ui` workspace.

### Database
- Schema definitions are located in `packages/db/src/schema/`.
- Exported `db` instance from `@itcamp-allcamp/db` provides type-safe access.
- Use `bun run db:push` for rapid schema prototyping and `db:generate`/`db:migrate` for versioned migrations.

### Monorepo Patterns
- **Workspace Catalogs:** The project uses Bun's workspace catalogs in `package.json` for centralized dependency version management.
- **Turborepo Tasks:** Task pipelines and caching are configured in `turbo.json`.

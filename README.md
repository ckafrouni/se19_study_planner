# SE19 Study Planner Monorepo

This is a monorepo for the SE19 Study Planner project, organized with Bun workspaces.

## Repository Structure

- `packages/prev`: A lightweight, high-performance drop-in replacement for Next.js that leverages React's latest server component features
- `packages/app`: The actual Study Planner application built using the prev framework

## Getting Started

```bash
# Install dependencies for all packages
bun install

# Start the development server
bun run dev

# Build the application
bun run build

# Start the production server
bun run start
```

## Package-specific Commands

### prev

```bash
# Run commands in the prev package
bun run --cwd packages/prev dev
bun run --cwd packages/prev build
bun run --cwd packages/prev start
```

### app

```bash
# Run commands in the app package
bun run --cwd packages/app dev
bun run --cwd packages/app build
bun run --cwd packages/app start

# Database commands
bun run --cwd packages/app db:generate
bun run --cwd packages/app db:migrate
bun run --cwd packages/app db:turso:dump
```

## Database

The local database is stored in `packages/app/local.db` and can be created by applying the dump from the turso database in `packages/app/src/db/dump.sql`.

Alternatively, you can use a remote turso (libsql/sqlite) database by setting the `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` environment variables in the `.env` file.

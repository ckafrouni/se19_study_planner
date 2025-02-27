# SE19 Study Planner App

This is the main application for the SE19 Study Planner, built using the prev framework.

## Getting Started

```bash
# Install dependencies
bun install

# Optional if using a local database
bun run db:turso:dump # pull the dump from the turso database and apply to local.db

# Start the development server
bun run dev

# Build for production
bun run build

# Start the production server
bun run start
```

## Database

The local database is stored in `local.db` and can be created by applying the dump from the turso database in `src/db/dump.sql`.

Alternatively, you can use a remote turso (libsql/sqlite) database by setting the `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` environment variables in the `.env` file.

## Database Commands

```bash
# Generate database migrations
bun run db:generate

# Apply database migrations
bun run db:migrate

# Dump the turso database to a local file
bun run db:turso:dump
```

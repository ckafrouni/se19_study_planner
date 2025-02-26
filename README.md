# cTack

## Modern React Server Components / Next.js-like Framework

cTack is a lightweight, high-performance drop-in replacement for Next.js that leverages React's latest server component features. Built for developers who want to dive deep into the mechanics that drive Next.js.

The server is built using [Elysia](https://elysiajs.com), a lightweight, high-performance framework.

### Key Features

- **Complete Server Components Support**: Every component is server-rendered using React's latest server component architecture
- **Next.js API Compatibility**: Designed as a seamless replacement for Next.js projects

### Supported Next.js Features

- File-based routing
- APP Router
- Server-side rendering
- Static folder serving
- Data fetching methods

Get started with cTack today for a modern, efficient React development experience.

### Setup local development environment

```bash
# install dependencies
bun install

# optional if using a local database
bun run local:db:pull # pull the dump from the turso database
bun run local:db:apply # apply the dump to the local database

# start the development server
bun run dev
```

The local database is stored in `src/db/local.db` and can be created by applying the dump from the turso database in `src/db/dump.sql`.

Alternatively, you can use a remote turso (libsql/sqlite) database by setting the `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` environment variables.

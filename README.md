# SE19 Study Planner Monorepo - Prev (Next.js clone)

This is a monorepo for the SE19 Study Planner project, organized with Bun workspaces.

## Repository Structure

- `packages/prev`: A lightweight, drop-in replacement for Next.js app router built using Elysia
- `packages/app`: The actual Study Planner/Task manager application built using the prev framework

## Project Motivation

I have not long ago started using NextJs and really liked the idea of using the folder structure and clear naming conventions in order to create an app router.

Having built a few apis and server-rendered web apps in express, the most annoying thing is the need to keep track of the different routes, their handlers, and the nested structure of the application.

Prev is a simple replacement, not fully featured like Next.js, but it still provides a good foundation for building web applications, apis, ...

I am using Elysia and Bun for the server rather than express, however for all intents and purposes, it behaves similarly.

The router supports:

- dynamic routes (example `/user/[id]`)
- static routes (example `/user/`)
- query parameters (example `/user/[id]?name=John`)

My app folder structure supports:

- `route.ts` turns a folder into a api route URL that supports GET, POST, PATCH, PUT, and DELETE
- `page.tsx` turns a folder into a page URL
- `layout.tsx` wraps every sub-page
- `(optional)/` groups files without affecting the URL
- `[id]/` creates a dynamic page/route

I also added support for hot reloading using a custom script that watches the folder structure changes in `app/` and re-runs the server, the web page has a live reload feature too based on a websocket, so that the page is automatically reloaded when the server is restarted.

## Getting Started

In packages/app, rename `example.db` to `local.db` and `.env.example` to `.env`.

```bash
# Setup database in packages/app
cd packages/app
mv example.db local.db
mv .env.example .env

# In development (at the root)
bun install
bun run dev

# In production (at the root)
bun run build
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

# Database commands to update the database schema
bun run --cwd packages/app db:studio
bun run --cwd packages/app db:generate
bun run --cwd packages/app db:migrate
```

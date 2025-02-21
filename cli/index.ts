import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";

import fs from "fs";
import path from "path";

import logger from "./utils/logger";

// MARK: - Router
const APP_DIR = path.join(path.dirname(__dirname), "src", "app");

import RootLayout from "../src/app/layout";

const wrap = (Page: JSX.Element) => RootLayout({ children: Page });

function generateRouter(
  dir: string,
  baseRoute: string = "",
  router = new Elysia()
) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      generateRouter(fullPath, path.join(baseRoute, entry.name), router);
    } else if (entry.name === "page.tsx" || entry.name === "page.jsx") {
      const route = baseRoute === "" ? "/" : baseRoute;
      const Page = require(fullPath).default;
      router = router.get(route, () => wrap(Page()), {});
    } else if (entry.name === "route.ts" || entry.name === "route.js") {
      const route_url = baseRoute === "" ? "/" : baseRoute;
      const routes = require(fullPath);

      if (routes.GET) {
        router = router.get(route_url, () => routes.GET());
      }
      if (routes.POST) {
        router = router.post(route_url, () => routes.POST());
      }
      if (routes.PUT) {
        router = router.put(route_url, () => routes.PUT());
      }
      if (routes.DELETE) {
        router = router.delete(route_url, () => routes.DELETE());
      }
    }
  }

  return router;
}

const appRouter = generateRouter(APP_DIR);

// MARK: - App

const app = new Elysia()
  .use(html({ autoDetect: true }))
  .use(logger)
  .use(appRouter)
  .use(staticPlugin())
  .use(swagger({ path: "/swagger" }))
  .onStart((app) => {
    console.log(
      `🦊 \x1b[0;32mcTack\x1b[0m is running at \x1b[0;32mhttp://${app.server?.hostname}:${app.server?.port}\x1b[0m`
    );
  });

app.listen(3000);

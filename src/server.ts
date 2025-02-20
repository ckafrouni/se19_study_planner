import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import api from "./app/api";
import logger from "./utils/logger";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";

import fs from "fs";
import path from "path";

// Pages

import RootLayout from "./app/pages/layout";

const wrap = (Page: JSX.Element) => RootLayout({ children: Page });

// Function to generate routes recursively
function generatePagesRouter(
  dir: string,
  baseRoute: string = "",
  router = new Elysia().use(html())
) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      generatePagesRouter(fullPath, path.join(baseRoute, entry.name), router);
    } else if (entry.name === "page.tsx" || entry.name === "page.jsx") {
      const route = baseRoute === "" ? "/" : baseRoute;
      const Page = require(fullPath).default;
      router = router.get(route, () => wrap(Page()));
    }
  }

  return router;
}

// Generate pages router
const pagesRouter = generatePagesRouter(path.join(__dirname, "app", "pages"));

// API

// App

const app = new Elysia()
  .use(logger)
  .group("api", (app) => app.use(api))
  .group("", (app) => app.use(pagesRouter))
  .use(staticPlugin())
  .use(swagger({ path: "/swagger" }))
  .onStart((app) => {
    console.log(
      `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
    );
  });

app.listen(3000);

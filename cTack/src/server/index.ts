import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";

import path from "path";

import logger from "../utils/logger";
import { generateRouter } from "./router";

// MARK: - Router

const ROOT_DIR = process.cwd();
const APP_DIR = path.join(ROOT_DIR, "src", "app");

const appRouter = generateRouter(APP_DIR);

// MARK: - App

const app = new Elysia()
  .use(html({ autoDetect: true }))
  .use(logger)
  .use(appRouter)
  .use(
    staticPlugin({
      noCache: process.env.NODE_ENV !== "production",
    })
  )
  .use(swagger({ path: "/swagger" }))
  .onStart((app) => {
    console.log(
      `🦊 \x1b[1;33mcTack\x1b[0m is running at \x1b[1;34mhttp://${app.server?.hostname}:${app.server?.port}\x1b[0m`
    );
  });

app.listen(3000);

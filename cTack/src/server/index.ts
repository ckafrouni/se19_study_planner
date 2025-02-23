import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";
import path from "path";
import { watch } from "fs";
import { WebSocketServer } from "ws";

import logger from "../utils/logger";
import { buildAppStructure } from "./appBuilder";
import { routerReducer } from "./routerBuilder";
import { clearAllAppCache, clearRequireCache } from "../utils/cache";

const ROOT_DIR = process.cwd();
const APP_DIR = path.join(ROOT_DIR, "src", "app");
const PORT = 3000;

// MARK: - App
function createApp() {
  // Clear all cached modules from APP_DIR

  const appStructure = buildAppStructure(APP_DIR);
  const appRouter = routerReducer(new Elysia(), appStructure);

  return new Elysia()
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
        `🦊 \x1b[1;33mcTack\x1b[0m \x1b[1mis running at\x1b[0m \x1b[1;34mhttp://${app.server?.hostname}:${app.server?.port}\x1b[0m`
      );
    });
}

const reloadWebSocketServer: WebSocketServer = new WebSocketServer({
  port: 3001,
});

let app = createApp();
app.listen(PORT);

// Watch for changes in APP_DIR
if (process.env.NODE_ENV !== "production") {
  console.log(`🦊 \x1b[1;30mWatching for changes\x1b[0m`);
  watch(APP_DIR, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      clearAllAppCache(APP_DIR);
      console.log(
        `🔄 \x1b[1;30mDetected change in ${filename}, reloading server...\x1b[0m`
      );

      // Stop the current server
      app.stop();

      // Create and start a new server instance
      app = createApp().listen(PORT);

      // Send reload signal to all connected clients
      reloadWebSocketServer.clients.forEach((client) => {
        client.send("reload");
      });
    }
  });
}

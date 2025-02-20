import { Elysia } from "elysia";
import frontend from "./web";
import api from "./api";
import logger from "./utils/logger";
import staticPlugin from "@elysiajs/static";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(logger)
  .group("api", (app) => app.use(api))
  .group("", (app) => app.use(frontend))
  .use(staticPlugin())
  .use(swagger({ path: "/swagger" }))
  .onStart((app) => {
    console.log(
      `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
    );
  });

app.listen(3000);

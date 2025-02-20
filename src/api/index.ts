import { Elysia } from "elysia";

const router = new Elysia()
  .get("/", () => "API : Hello World")
  .get("/test", () => "API : Hello Test")
  .get("/test/hey", () => "API : Hello Test");

export default router;

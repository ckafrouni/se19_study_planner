import { Handler, Elysia } from "elysia";

export const GET: Handler = (ctx) => "API (/foo) : Hello World";

// export default new Elysia().get("/", GET);

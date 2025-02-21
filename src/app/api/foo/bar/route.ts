import { Handler, Elysia } from "elysia";

export const GET: Handler = (ctx) => "API (/foo/bar) : Hello World";

// export default new Elysia().get("/", GET);

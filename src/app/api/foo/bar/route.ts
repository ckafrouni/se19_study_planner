import { Context } from "elysia";

export function GET(ctx: Context) {
  return {
    message: "API (/foo/bar) : Hello World",
  };
}

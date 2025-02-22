import { Context } from "elysia";

export function GET(ctx: Context) {
  return {
    message: `API (/api/(skip)/noskip) : Hello World`,
  };
}

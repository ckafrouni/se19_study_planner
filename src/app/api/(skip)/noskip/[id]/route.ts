import { Context } from "elysia";

export function GET(ctx: Context) {
  return {
    id: ctx.params.id,
    message: `API (/api/(skip)/noskip/${ctx.params.id}) : Hello World`,
  };
}

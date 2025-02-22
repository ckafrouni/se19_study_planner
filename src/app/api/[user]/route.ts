import { Context } from "elysia";

export function GET(ctx: Context) {
  return {
    message: `API (/api/${ctx.params.user}) : Hello World`,
    user: ctx.params.user,
    age: ctx.query.age,
  };
}

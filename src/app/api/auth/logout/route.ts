import { Context } from "elysia";

export async function POST({ cookie, redirect }: Context) {
  delete cookie["userId"];
  redirect("/");
}

import { Context } from "elysia";

export async function POST({ cookie, redirect }: Context) {
  delete cookie["userId"];
  console.log(cookie);
  return redirect("/");
}

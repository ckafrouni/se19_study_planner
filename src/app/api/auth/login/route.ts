import { UserDAL } from "@/db/dal/users";
import { Context } from "elysia";

export async function POST({ body, set, redirect, cookie }: Context) {
  // @ts-ignore
  const { email, password } = body;
  const isValid = await UserDAL.verifyPassword(email, password);

  if (!isValid) {
    set.status = 401;
    return { error: "Invalid credentials" };
  }

  const user = await UserDAL.findByEmail(email);
  if (!user) {
    set.status = 401;
    return { error: "Invalid credentials" };
  }

  cookie["userId"].value = user.id.toString();
  cookie["userId"].maxAge = 7 * 24 * 60 * 60; // 7 days
  redirect(`/user/${user.id}`);
}

import { UserDAL } from "@/db/dal/users";
import { Context } from "elysia";

export async function POST({ body, set, redirect, cookie }: Context) {
  try {
    // @ts-ignore
    const { email, password, name } = body;
    const user = await UserDAL.createUser({
      email,
      password,
      name,
    });

    cookie["userId"].value = user.id.toString();
    cookie["userId"].maxAge = 7 * 24 * 60 * 60; // 7 days
    redirect(`/user/${user.id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "Email already exists") {
      set.status = 400;
      return { error: "Email already exists" };
    }
    set.status = 500;
    return { error: "Internal server error" };
  }
}

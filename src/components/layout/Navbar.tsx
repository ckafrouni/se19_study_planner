import { ButtonLink } from "@/components/ui/button";
import { FormButton } from "@/components/ui/form";

import { Context } from "elysia";

export default function Navbar({
  className,
  ctx,
}: {
  className?: string;
  ctx: Context;
}) {
  return (
    <div
      className={`w-full h-16 p-3 border-b border-gray-200 bg-white text-sm ${className}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold font-mono">
          <a href="/">Study Planner</a>
        </h1>

        <div className="flex gap-2">
          {ctx.cookie.userId.value ? (
            <>
              <ButtonLink href={`/user/${ctx.cookie.userId.value}`}>
                Profile
              </ButtonLink>
              <form action="/api/auth/logout" method="POST">
                <FormButton type="submit">Logout</FormButton>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/auth/login">Login</ButtonLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

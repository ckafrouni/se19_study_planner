import { Context } from "elysia";

export default function Layout({
  children,
  ctx,
}: {
  children: React.ReactNode;
  ctx: Context;
}) {
  throw ctx.redirect("/");

  return (
    <div>
      <h1>Forbidden</h1>
      {children}
    </div>
  );
}

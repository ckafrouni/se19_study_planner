import { Context } from "elysia";

export default function HomePage({
  ctx,
  query: { friend, enemy },
}: {
  ctx: Context;
  query: { friend: string; enemy: string };
}) {
  return (
    <div className="w-full p-3">
      <div className="container mx-auto">
        <h1>Home Page</h1>
        <p>Friend: {friend}</p>
        <p>Enemy: {enemy}</p>
      </div>
    </div>
  );
}

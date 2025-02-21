import { Html } from "@elysiajs/html";

export default function HomePage({
  query: { friend, enemy },
}: {
  query: { friend: string; enemy: string };
}) {
  return (
    <div class="w-full p-3">
      <div class="container mx-auto">
        <h1>Home Page</h1>
        <p>Friend: {friend}</p>
        <p>Enemy: {enemy}</p>
      </div>
    </div>
  );
}

import { Html } from "@elysiajs/html";

export default function UserPage({
  params: { user },
  query: { age },
}: {
  params: { user: string };
  query: { age: string };
}) {
  return (
    <div class="w-full p-3">
      <div class="container mx-auto">
        <h1>User Page</h1>
        <p>User: {user}</p>
        <p>Age: {age}</p>
      </div>
    </div>
  );
}

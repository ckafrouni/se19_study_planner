export default function UserPage({
  params: { user },
  query: { age },
}: {
  params: { user: string };
  query: { age: string };
}) {
  return (
    <div className="w-full p-3">
      <div className="container mx-auto">
        <h1>User Page</h1>
        <p>User: {user}</p>
        <p>Age: {age}</p>
      </div>
    </div>
  );
}

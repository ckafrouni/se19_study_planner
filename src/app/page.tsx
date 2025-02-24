export default async function HomePage({
  query: { friend, enemy },
}: {
  query: { friend: string; enemy: string };
}) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

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

export default function HomePage({
  query: { friend, enemy },
}: {
  query: { friend: string; enemy: string };
}) {
  return (
    <div className="w-full p-3">
      <div className="container mx-auto">
        <h1>Homeles</h1>
        <p>Friend: {friend}</p>
        <p>Enemy: {enemy}</p>
      </div>
    </div>
  );
}

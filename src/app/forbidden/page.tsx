export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Forbidden</h1>
            <p className="text-gray-500">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

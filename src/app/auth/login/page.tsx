export default () => {
  return (
    <div className="max-w-md w-full space-y-8 p-8 rounded-lg place-self-center">
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form className="mt-8 space-y-6" action="/api/auth/login" method="POST">
        <div className="rounded-md -space-y-px">
          <div>
            <input
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-neutral-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
          >
            Sign in
          </button>
        </div>
      </form>
      <div className="text-center">
        <a
          href="/auth/signup"
          className="text-neutral-600 hover:text-neutral-500"
        >
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
};

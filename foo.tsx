import Elysia, { Context } from 'elysia'
import { ReactNode } from 'react'
import { renderToReadableStream } from 'react-dom/server'

// Basic async Key-Value database
class Sessions {
  private kv = new Map<string, any>()
  static instance = new Sessions()

  constructor() {}

  async get(key: string) {
    return this.kv.get(key)
  }

  async set(key: string, value: any) {
    this.kv.set(key, value)
  }

  async dump() {
    console.log(this.kv)
  }
}

const Profile = async ({ ctx }: { ctx: Context }) => {
  // Check if user is authenticated
  if (!ctx.cookie.sessionID.value) {
    throw new Response(null, { status: 307, headers: { location: '/' } })
  }

  // Get user from session
  const user = await Sessions.instance.get(ctx.cookie.sessionID.value)
  if (!user) {
    throw new Response(null, { status: 307, headers: { location: '/' } })
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.age}</p>
    </div>
  )
}

const Home = (...args: any) => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

const Login = (...args: any) => {
  return (
    <div>
      <h1>Login</h1>
      <form action="/api/auth/login" method="POST">
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <body>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
            <li>
              <a href="/login">Login</a>
            </li>
            <li>
              <form action="/api/auth/logout" method="POST">
                <button type="submit">Logout</button>
              </form>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  )
}

type ReactNodeFn = (ctx: Context) => ReactNode
type RouteFn = (ctx: Context) => Response

const ROUTES: Record<string, ReactNodeFn | RouteFn> = {
  '/': (ctx: Context) => (
    <Layout>
      <Home ctx={ctx} />
    </Layout>
  ),
  '/profile': (ctx: Context) => (
    <Layout>
      <Profile ctx={ctx} />
    </Layout>
  ),
  '/login': (ctx: Context) => (
    <Layout>
      <Login ctx={ctx} />
    </Layout>
  ),
  '/api/auth/login': (ctx: Context) => {
    console.log(ctx)
    ctx.cookie.sessionID.value = '123'
    return new Response(null, { status: 303, headers: { location: '/' } })
  },
}

async function handleRoute(ctx: Context, route: keyof typeof ROUTES) {
  if (!(route in ROUTES)) {
    return new Response('Not found', { status: 404 })
  }

  const handler = ROUTES[route]
  const result = handler(ctx)

  if (result instanceof Response) {
    return result
  }

  try {
    ctx.set.headers['content-type'] = 'text/html'
    const stream = await renderToReadableStream(result, {
      onError() {
        console.log('We have an error!')
      },
    })
    return new Response(stream, {
      headers: {
        'content-type': 'text/html',
      },
    })
  } catch (e) {
    console.log(e)
    return e
  }
}

let app = new Elysia()
for (const route in ROUTES) {
  app = app.get(route, async (ctx: Context) => handleRoute(ctx, route))
}

app
  .post('/api/auth/login', async (ctx: Context) => {
    console.log(ctx)
    ctx.cookie.sessionID.value = '123'
    ctx.cookie.sessionID.maxAge = 7 * 24 * 60 * 60 // 7 days
    Sessions.instance.set(ctx.cookie.sessionID.value, {
      name: 'John',
      age: 30,
    })
    return new Response(null, { status: 303, headers: { location: '/' } })
  })
  .post('/api/auth/logout', async (ctx: Context) => {
    ctx.cookie.sessionID.remove()
    return new Response(null, { status: 303, headers: { location: '/' } })
  })
  .onStart(() => {
    console.log(
      `🦊 \x1b[1;33mFoo\x1b[0m is running at \x1b[1;34mhttp://localhost:3000\x1b[0m`
    )
  })
  .listen(3000)

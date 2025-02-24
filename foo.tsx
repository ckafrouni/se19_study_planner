import Elysia, { Context } from "elysia";
import { renderToReadableStream } from "react-dom/server";

const Main = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 2000)); // returns the user

  return (
    <div>
      <h1>Hello, World</h1>
    </div>
  );
};

const App = () => {
  return (
    <html>
      <head>
        <title>Server Side Rendered App</title>
      </head>
      <body>
        <Main />
      </body>
    </html>
  );
};

async function pageHandler(ctx: Context) {
  ctx.set.headers["content-type"] = "text/html";
  const stream = await renderToReadableStream(<App />);
  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
}

async function apiHandler(ctx: Context) {
  return new Response(JSON.stringify({ message: "Hello World!" }), {
    headers: {
      "content-type": "application/json",
    },
  });
}

const app = new Elysia()
  .get("/", async (ctx: Context) => pageHandler(ctx))
  .get("/api", async (ctx: Context) => apiHandler(ctx))
  .get("/redirect-root", async (ctx: Context) => ctx.redirect("/"));

app
  .onStart(() => {
    console.log(
      `🦊 \x1b[1;33mFoo\x1b[0m is running at \x1b[1;34mhttp://localhost:3000\x1b[0m`
    );
  })
  .listen(3000);

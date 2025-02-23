import { Elysia, Context, Handler } from "elysia";
import { ReactElement } from "react";
import { renderToReadableStream, renderToString } from "react-dom/server";

import { AppNode } from "./appBuilder";
import LiveReloadScript from "./components/LiveReloadScript";

function Layouts({
  children,
  layouts,
}: {
  children: ReactElement;
  layouts: ((props: { children: ReactElement }) => ReactElement)[];
}) {
  return layouts.reduceRight(
    (wrapped, Layout) => <Layout>{wrapped}</Layout>,
    children
  );
}

function pageRouter({
  dev,
  router,
  fullPath,
  url,
  currentLayouts,
}: {
  dev: boolean;
  router: Elysia;
  fullPath: string;
  url: string;
  currentLayouts: ((props: { children: ReactElement }) => ReactElement)[];
}) {
  const Page = require(fullPath).default;

  return router.get(url, async ({ query, params }: Context) => {
    const stream = await renderToReadableStream(
      <Layouts layouts={currentLayouts}>
        <>
          <Page query={query} params={params} />
          {dev && <LiveReloadScript />}
        </>
      </Layouts>
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  });
}

function routeRouter({
  router,
  url,
  routes,
}: {
  router: Elysia;
  url: string;
  routes: {
    GET?: Handler;
    POST?: Handler;
    PATCH?: Handler;
    PUT?: Handler;
    DELETE?: Handler;
  };
}) {
  if (routes?.GET) router = router.get(url, routes.GET);
  if (routes?.POST) router = router.post(url, routes.POST);
  if (routes?.PATCH) router = router.patch(url, routes.PATCH);
  if (routes?.PUT) router = router.put(url, routes.PUT);
  if (routes?.DELETE) router = router.delete(url, routes.DELETE);

  return router;
}

export function routerReducer(
  router: Elysia,
  { type, name, fullPath, url, children, routes, layout }: AppNode,
  layouts: ((props: { children: ReactElement }) => ReactElement)[] = []
): Elysia {
  const currentLayouts = layout ? [...layouts, layout] : layouts;

  switch (type) {
    case "directory":
    case "group":
      return (
        children?.reduce(
          (r, child) => routerReducer(r, child, currentLayouts),
          router
        ) ?? router
      );
    case "page":
      const Page = require(fullPath).default;
      return pageRouter({
        dev: process.env.NODE_ENV !== "production",
        router,
        fullPath,
        url,
        currentLayouts,
      });
    case "route":
      return routeRouter({
        router,
        url,
        routes: routes!,
      });
    default:
      return router;
  }
}

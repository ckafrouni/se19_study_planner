import { Elysia, Context, Handler } from "elysia";
import { ReactElement } from "react";
import { renderToString } from "react-dom/server";

import InjectLiveReloadScript from "./components/InjectLiveReloadScript";

import { AppNode } from "./appBuilder";

function wrapWithLayouts(
  Component: () => ReactElement,
  layouts: ((props: { children: ReactElement }) => ReactElement)[]
): () => ReactElement {
  return () =>
    layouts.reduceRight(
      (wrapped, Layout) => <Layout>{wrapped}</Layout>,
      <Component />
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
  return router.get(url, ({ query, params }: Context) => {
    const pageComponent = () => <Page params={params} query={query} />;
    return renderToString(
      dev
        ? InjectLiveReloadScript(
            wrapWithLayouts(pageComponent, currentLayouts)
          )()
        : wrapWithLayouts(pageComponent, currentLayouts)()
    );
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

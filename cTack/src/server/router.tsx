import fs from "fs";
import path from "path";
import Elysia, { Handler } from "elysia";
import { Html } from "@elysiajs/html";

const DEV = process.env.NODE_ENV !== "production";

interface AppNode {
  type: "directory" | "page" | "route" | "layout" | "unknown";
  name: string;
  fullPath: string;
  url: string;
  children?: AppNode[];
  routes?: {
    GET?: Handler;
    POST?: Handler;
    PUT?: Handler;
    DELETE?: Handler;
  };
  layout?: (props: { children: JSX.Element }) => JSX.Element;
  paramName?: string;
}

function injectLiveReloadScript(
  component: () => JSX.Element
): () => JSX.Element {
  return () => (
    <>
      {component()}
      <script src="/public/live-reload.js"></script>
    </>
  );
}

function buildAppStructure(dir: string, baseUrl: string = "/"): AppNode {
  const entry = fs.statSync(dir);
  const name = path.basename(dir);
  const isDynamic = name.startsWith("[") && name.endsWith("]");
  const paramName = isDynamic ? name.slice(1, -1) : undefined;

  if (entry.isDirectory()) {
    const children = fs
      .readdirSync(dir, { withFileTypes: true })
      .map((childEntry) => {
        const childPath = path.join(dir, childEntry.name);
        let childUrl =
          name === "app"
            ? baseUrl
            : path.join(baseUrl, isDynamic ? `:${paramName}` : name);
        return buildAppStructure(childPath, childUrl);
      })
      .filter(Boolean);

    const layoutFile = children.find((child) => child.type === "layout");
    if (layoutFile) {
      children.splice(children.indexOf(layoutFile), 1);
    }

    return {
      type: "directory",
      name,
      fullPath: dir,
      url:
        name === "app"
          ? "/"
          : path.join(baseUrl, isDynamic ? `:${paramName}` : name),
      children,
      paramName,
      layout: layoutFile ? require(layoutFile.fullPath).default : undefined,
    };
  } else {
    const url = name.startsWith("page.")
      ? baseUrl
      : path.join(baseUrl, name.split(".")[0]);
    if (name === "page.tsx" || name === "page.jsx") {
      return {
        type: "page",
        name,
        fullPath: dir,
        url,
      };
    } else if (name === "route.ts" || name === "route.js") {
      const routes = require(dir);
      return {
        type: "route",
        name,
        fullPath: dir,
        url,
        routes,
      };
    } else if (name === "layout.tsx" || name === "layout.jsx") {
      return {
        type: "layout",
        name,
        fullPath: dir,
        url,
      };
    }
    // Ignore other file types
    return {
      type: "unknown",
      name,
      fullPath: dir,
      url,
    };
  }
}

function wrapWithLayouts(
  Component: () => JSX.Element,
  layouts: ((props: { children: JSX.Element }) => JSX.Element)[]
): () => JSX.Element {
  return () =>
    layouts.reduceRight(
      (wrapped, Layout) => <Layout>{wrapped}</Layout>,
      <Component />
    );
}

function routerReducer(
  router: Elysia,
  node: AppNode,
  layouts: ((props: { children: JSX.Element }) => JSX.Element)[] = []
): Elysia {
  const currentLayouts = node.layout ? [...layouts, node.layout] : layouts;

  switch (node.type) {
    case "directory":
      return (
        node.children?.reduce(
          (r, child) => routerReducer(r, child, currentLayouts),
          router
        ) ?? router
      );
    case "page":
      const Page = require(node.fullPath).default;
      return router.get(
        node.url,
        ({ query, params }) => {
          const pageComponent = () => <Page params={params} query={query} />;
          return DEV
            ? injectLiveReloadScript(
                wrapWithLayouts(pageComponent, currentLayouts)
              )()
            : wrapWithLayouts(pageComponent, currentLayouts)();
        },
        {}
      );
    case "route":
      if (node.routes?.GET) router = router.get(node.url, node.routes.GET);
      if (node.routes?.POST) router = router.post(node.url, node.routes.POST);
      if (node.routes?.PUT) router = router.put(node.url, node.routes.PUT);
      if (node.routes?.DELETE)
        router = router.delete(node.url, node.routes.DELETE);
      return router;
    default:
      return router;
  }
}

export function generateRouter(dir: string): Elysia {
  const appStructure = buildAppStructure(dir);
  console.log(JSON.stringify(appStructure, null, 2));
  return routerReducer(new Elysia(), appStructure);
}

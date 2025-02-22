import fs from "fs";
import path from "path";

import { ReactElement } from "react";
import { Handler } from "elysia";

export interface AppNode {
  type: "directory" | "page" | "route" | "layout" | "unknown" | "group";
  name: string;
  fullPath: string;
  url: string;
  children?: AppNode[];
  routes?: {
    GET?: Handler;
    POST?: Handler;
    PATCH?: Handler;
    PUT?: Handler;
    DELETE?: Handler;
  };
  layout?: (props: { children: ReactElement }) => ReactElement;
  paramName?: string;
}

export function buildAppStructure(dir: string, baseUrl: string = "/"): AppNode {
  const entry = fs.statSync(dir);
  const name = path.basename(dir);
  const isDynamic = name.startsWith("[") && name.endsWith("]");
  const isGroup = name.startsWith("(") && name.endsWith(")");
  const paramName = isDynamic ? name.slice(1, -1) : undefined;

  if (entry.isDirectory()) {
    const children = fs
      .readdirSync(dir, { withFileTypes: true })
      .map((childEntry) => {
        const childPath = path.join(dir, childEntry.name);
        let childUrl = baseUrl;
        if (!isGroup && name !== "app") {
          childUrl = path.join(baseUrl, isDynamic ? `:${paramName}` : name);
        }
        return buildAppStructure(childPath, childUrl);
      })
      .filter(Boolean);

    const layoutFile = children.find((child) => child.type === "layout");
    if (layoutFile) {
      children.splice(children.indexOf(layoutFile), 1);
    }

    return {
      type: isGroup ? "group" : "directory",
      name,
      fullPath: dir,
      url: isGroup
        ? baseUrl
        : name === "app"
        ? "/"
        : path.join(baseUrl, isDynamic ? `:${paramName}` : name),
      children,
      paramName,
      layout: layoutFile ? require(layoutFile.fullPath).default : undefined,
    };
  } else {
    const url = baseUrl;
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

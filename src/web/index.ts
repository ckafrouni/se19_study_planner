import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";

import { RootLayout } from "./pages/layout";

import HomePage from "./pages/page";
import LoginPage from "./pages/auth/login/page";
import SignupPage from "./pages/auth/signup/page";

const wrap = (Page: JSX.Element) => RootLayout({ children: Page });

let router = new Elysia().use(html());

const routes = new Map<string, () => JSX.Element>([
  ["/", HomePage],
  ["/auth/login", LoginPage],
  ["/auth/signup", SignupPage],
]);

for (const [route, Page] of routes) {
  router = router.get(route, () => wrap(Page()));
}

export default router;

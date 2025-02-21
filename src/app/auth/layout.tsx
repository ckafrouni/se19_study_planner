import { Html } from "@elysiajs/html";

export default function AuthLayout({ children }: { children: JSX.Element }) {
  return <div class="bg-red-500">{children}</div>;
}

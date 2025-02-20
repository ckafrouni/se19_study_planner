import { Html } from "@elysiajs/html";
import { ButtonLink } from "../ui/button";

export default function Navbar({ class: className }: { class?: string }) {
  return (
    <div
      class={`w-full h-16 p-3 border-b border-gray-200 bg-white text-sm ${className}`}
    >
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-3xl font-bold font-mono">
          <a href="/">Study Planner</a>
        </h1>

        <div class="flex gap-2">
          <ButtonLink href="/auth/login">Login</ButtonLink>
          <ButtonLink href="/auth/signup">Sign Up</ButtonLink>
        </div>
      </div>
    </div>
  );
}

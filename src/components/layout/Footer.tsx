import { Html } from "@elysiajs/html";

export default function Footer() {
  return (
    <footer class=" border-t border-gray-200 text-sm text-gray-500">
      <div class="container mx-auto flex items-center justify-between p-3 w-full">
        <p>© 2024 Study Planner. All rights reserved.</p>

        <div class="flex gap-2">
          <a
            href="https://elysiajs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              class={"w-6 h-6"}
              src="/public/icons/ElysiaJS.png"
              alt="ElysiaJS"
            />
          </a>

          <a
            href="https://github.com/ckafrouni/se19_study_planner"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              class={"w-6 h-6"}
              src="/public/icons/GitHub.png"
              alt="GitHub"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

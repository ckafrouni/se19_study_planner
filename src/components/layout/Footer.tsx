export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`border-t border-gray-200 bg-white text-sm text-gray-500 ${className}`}
    >
      <div className="container mx-auto flex w-full items-center justify-between p-3">
        <p className="text-xs text-gray-500">2024 Study Planner.</p>

        <div className="flex gap-2">
          <a
            href="https://elysiajs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              width={24}
              height={24}
              className="h-6 w-6"
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
              width={24}
              height={24}
              className="h-6 w-6"
              src="/public/icons/GitHub.png"
              alt="GitHub"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}

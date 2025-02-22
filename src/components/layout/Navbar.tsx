import { ButtonLink } from "@/components/ui/button";

export default function Navbar({ className }: { className?: string }) {
  return (
    <div
      className={`w-full h-16 p-3 border-b border-gray-200 bg-white text-sm ${className}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold font-mono">
          <a href="/">Study Planner</a>
        </h1>

        <div className="flex gap-2">
          <ButtonLink href="/auth/login">Login</ButtonLink>
          <ButtonLink href="/auth/signup">Sign Up</ButtonLink>
        </div>
      </div>
    </div>
  );
}

import { ButtonLink } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="container mx-auto grid w-full h-full place-items-center">
      <div className="flex flex-col items-center justify-center p-3 gap-2">
        <h1 className="xl:text-5xl lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold">
          Code Study Planner
        </h1>
        <p className="xl:text-lg lg:text-lg md:text-base sm:text-sm text-xs">
          Plan your study schedule
        </p>
        <ButtonLink
          className="bg-neutral-800 hover:bg-neutral-900 text-white"
          href="/auth/login"
        >
          Get Started
        </ButtonLink>
      </div>
    </main>
  );
}

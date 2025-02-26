import { ButtonLink } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="container mx-auto grid h-full w-full place-items-center">
      <div className="flex flex-col items-center justify-center gap-2 p-3">
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl">
          Code Study Planner
        </h1>
        <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-lg">
          Plan your study schedule
        </p>
        <ButtonLink
          className="bg-neutral-800 text-white hover:bg-neutral-900"
          href="/auth/login"
        >
          Get Started
        </ButtonLink>
      </div>
    </main>
  )
}

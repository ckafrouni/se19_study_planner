import { ButtonLink } from '@/components/ui/button'
import { FormButton } from '@/components/ui/form'

import { Context } from 'elysia'

export default function Navbar({
  className,
  ctx,
}: {
  className?: string
  ctx: Context
}) {
  const user = JSON.parse(ctx.cookie['user']?.value || 'null')

  return (
    <div
      className={`h-16 w-full border-b border-gray-200 bg-white p-3 text-sm ${className}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <a href="/">Study Planner</a>
        </h1>

        <div className="flex gap-2">
          {user ? (
            <>
              <ButtonLink href={`/user/${user.id}`}>Profile</ButtonLink>
              <form action="/api/auth/logout" method="POST">
                <FormButton
                  className="bg-red-500 text-white hover:bg-red-600"
                  type="submit"
                >
                  Logout
                </FormButton>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/auth/login">Login</ButtonLink>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

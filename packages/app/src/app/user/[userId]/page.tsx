import { authDal } from '@/db'
import { Context } from 'elysia'

export default async function Page({
  ctx: { cookie, redirect },
  params: { userId },
}: {
  ctx: Context
  params: { userId: any }
}) {
  const sessionToken = cookie.sessionToken.value
  if (!userId || !sessionToken) {
    throw redirect('/auth/login')
  }

  const session = await authDal.getSessionByToken(sessionToken)

  if (!session) {
    throw redirect('/auth/login')
  }

  if (session.userId !== Number(userId)) {
    throw redirect('/auth/login')
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
          {session.user.name}
        </h1>
        <div className="flex flex-col items-center space-y-2 text-sm text-gray-500">
          <p>{session.user.email}</p>
          <p>
            Member since {new Date(session.user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

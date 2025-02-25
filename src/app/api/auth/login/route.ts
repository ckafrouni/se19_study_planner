import { authDal } from '@/db'
import { Context } from 'elysia'

export const ERROR_TYPES = {
  invalid_credentials: {
    code: 'invalid_credentials',
    message: 'Invalid credentials',
  },
} as const

export async function POST({ body, set, redirect, cookie }: Context) {
  // @ts-ignore
  const { email, password } = body

  const user = await authDal.verifyCredentials(email, password)
  if (!user) {
    set.status = 401
    return redirect(`/auth/login?error=${ERROR_TYPES.invalid_credentials.code}`)
  }

  const session = await authDal.createSession(user.id)

  cookie['sessionToken'].value = session.token
  cookie['sessionToken'].maxAge = 7 * 24 * 60 * 60 // 7 days
  cookie['user'].value = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
  })
  cookie['user'].maxAge = 7 * 24 * 60 * 60 // 7 days
  return redirect(`/user/${user.id}`)
}

import { authDal } from '@/db'
import { Context } from 'elysia'
import { API_ERRORS } from '@/app/api/errors'

export async function POST({ body, set, redirect, cookie }: Context) {
  // @ts-ignore
  const { email, password } = body

  const user = await authDal.verifyCredentials(email, password)
  if (!user) {
    set.status = 401
    return redirect(`/auth/login?error=${API_ERRORS.invalid_credentials.code}`)
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

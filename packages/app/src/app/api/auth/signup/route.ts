import { authDal } from '@/db'
import { Context } from 'elysia'
import { API_ERRORS } from '@/app/api/errors'

export async function POST({ body, redirect, cookie }: Context) {
  // @ts-ignore
  const { email, name, password } = body

  // Validate inputs
  if (!name || !email || !password) {
    return redirect(`/auth/signup?error=${API_ERRORS.incomplete_data.code}`)
  }

  if (password.length < 8) {
    return redirect(`/auth/signup?error=${API_ERRORS.password_too_short.code}`)
  }

  try {
    // Transaction logic handled inside these methods
    const user = await authDal.createUser({ name, email })
    await authDal.createPasswordAuth(user.id, password)

    // Create session for automatic login
    const session = await authDal.createSession(user.id)
    cookie['sessionToken'].value = session.token
    cookie['sessionToken'].maxAge = 7 * 24 * 60 * 60 // 7 days
    cookie['user'].value = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    cookie['user'].maxAge = 7 * 24 * 60 * 60 // 7 days

    return redirect(`/`)
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return redirect(
        `/auth/signup?error=${API_ERRORS.user_already_exists.code}`
      )
    }
    return redirect(`/auth/signup?error=${API_ERRORS.unknown_error.code}`)
  }
}

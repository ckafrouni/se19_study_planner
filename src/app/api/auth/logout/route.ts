import { Context } from 'elysia'
import { authDal } from '@/db'

export async function POST({ cookie, redirect }: Context) {
  try {
    await authDal.invalidateSession(cookie['sessionToken'].value!)
    cookie['sessionToken'].remove()
    cookie['user'].remove()
  } catch (error) {
    // ignore
  }

  return redirect('/')
}

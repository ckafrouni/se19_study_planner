import { authDal, tasksDal } from '@/db'
import { Context } from 'elysia'
import { API_ERRORS } from '@/app/api/errors'

export const POST = async ({ body, set, redirect, cookie }: Context) => {
  // Check if the user is authenticated
  const sessionToken = cookie.sessionToken.value
  if (!sessionToken) {
    throw redirect('/auth/login')
  }

  const session = await authDal.getSessionByToken(sessionToken)

  if (!session) {
    throw redirect('/auth/login')
  }

  // @ts-ignore
  const { task } = body

  try {
    const tasks = await tasksDal.createTask({
      userId: session.userId,
      task,
    })
    return redirect(`/tasks`)
  } catch (error) {
    console.error('Failed to create task:', error)
    throw redirect(`/tasks?error=${API_ERRORS.failed_to_create_task.code}`)
  }
}

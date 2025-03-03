import { authDal, tasksDal } from '@/db'
import { Context } from 'elysia'
import { API_ERRORS } from '@/app/api/errors'

export const POST = async ({
  params: { task_id },
  cookie,
  redirect,
  body,
}: Context) => {
  console.log(`DEBUG: POST /api/tasks/[task_id]`, task_id, body)

  // Check if the user is authenticated
  const sessionToken = cookie.sessionToken.value
  console.log(sessionToken)
  if (!sessionToken) {
    throw redirect('/auth/login')
  }

  const session = await authDal.getSessionByToken(sessionToken)

  if (!session) {
    throw redirect('/auth/login')
  }

  // Check if the task exists
  let taskId: number
  try {
    taskId = Number(task_id)
  } catch (error) {
    throw redirect(`/tasks?error=${API_ERRORS.task_not_found.code}`)
  }

  const task = await tasksDal.getTaskById(taskId)
  if (!task) {
    throw redirect(`/tasks?error=${API_ERRORS.task_not_found.code}`)
  }

  // @ts-ignore
  const { task: updatedTask, status, delete: deleteTask } = body

  if (deleteTask) {
    try {
      await tasksDal.deleteTask(taskId)
      return redirect(`/tasks`)
    } catch (error) {
      console.error('Failed to delete task:', error)
      throw redirect(`/tasks?error=${API_ERRORS.failed_to_delete_task.code}`)
    }
  }

  try {
    await tasksDal.updateTask(taskId, {
      task: updatedTask ?? task.task,
      status: status ?? task.status,
    })
    return redirect(`/tasks`)
  } catch (error) {
    console.error('Failed to update task:', error)
    throw redirect(`/tasks?error=${API_ERRORS.failed_to_update_task.code}`)
  }
}

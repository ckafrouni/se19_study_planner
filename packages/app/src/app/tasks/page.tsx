import { Form, FormField } from '@/components/ui/form'
import { authDal, tasksDal } from '@/db'
import { SelectTask } from '@/db/schema'
import {
  PlusCircleIcon,
  SquareCheck,
  Square,
  Pencil,
  Check,
  LucideDelete,
} from 'lucide-react'

const QUERY_KEYS = ['edit', 'task_id'] as const

export default async function TasksPage({
  query,
  ctx: { cookie, redirect },
}: {
  query: Record<string, string>
  ctx: { cookie: any; redirect: any }
}) {
  // Check if the user is authenticated
  const sessionToken = cookie.sessionToken.value
  if (!sessionToken) {
    throw redirect('/auth/login')
  }

  const session = await authDal.getSessionByToken(sessionToken)

  if (!session) {
    throw redirect('/auth/login')
  }

  // Get the query parameters
  const { edit, task_id } = query

  const editTask = edit == 'true'
  const taskId = task_id ? Number(task_id) : null

  // Get tasks
  const tasks = await tasksDal.getAllTasks({ userId: session.userId })

  return (
    <div className="container mx-auto flex flex-col gap-4 p-3">
      <AddTaskForm />
      <TasksList tasks={tasks} editTask={editTask} taskId={taskId} />
    </div>
  )
}

function AddTaskForm() {
  return (
    <div>
      <Form action="/api/tasks" method="POST" className="flex gap-2">
        <FormField
          name="task"
          type="text"
          placeholder="Task"
          required
          className="mb-0"
        />
        <button type="submit" className="flex items-center">
          <PlusCircleIcon className="text-neutral-500 hover:text-black" />
        </button>
      </Form>
    </div>
  )
}

function TasksList({
  tasks,
  editTask,
  taskId,
}: {
  tasks: SelectTask[]
  editTask: boolean
  taskId: number | null
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Your Tasks</h2>
      <div className="mt-2 flex flex-col gap-2 text-center">
        {tasks.length === 0 && (
          <p className="text-neutral-500">You have no tasks</p>
        )}
        {tasks.map((task) => (
          <Task key={task.id} task={task} editTask={editTask} taskId={taskId} />
        ))}
      </div>
    </div>
  )
}

function Task({
  task,
  editTask,
  taskId,
}: {
  task: SelectTask
  editTask: boolean
  taskId: number | null
}) {
  return (
    <div className="flex items-center gap-2 text-start">
      <form
        action={`/api/tasks/${task.id}`}
        method="post"
        className="flex text-neutral-500 hover:text-black"
      >
        {task.status === 'TODO' ? (
          <button type="submit" className="" name="status" value="DONE">
            <Square />
          </button>
        ) : (
          <button type="submit" className="" name="status" value="TODO">
            <SquareCheck />
          </button>
        )}
      </form>

      {editTask && taskId === task.id ? (
        <form
          action={`/api/tasks/${task.id}`}
          method="POST"
          className="flex flex-1 gap-2"
        >
          <FormField
            name="task"
            type="text"
            defaultValue={task.task}
            required
            placeholder="Task"
          />
          <button type="submit" className="">
            <Check />
          </button>
        </form>
      ) : (
        <>
          <div className="flex-1">{task.task}</div>
          <a
            className="text-neutral-500 hover:text-black"
            href={`/tasks?edit=true&task_id=${task.id}`}
            aria-disabled={editTask}
          >
            <Pencil />
          </a>
          <form action={`/api/tasks/${task.id}`} method="post">
            <button type="submit" name="delete" value="true">
              <LucideDelete className="text-red-500 hover:text-red-700" />
            </button>
          </form>
        </>
      )}
    </div>
  )
}

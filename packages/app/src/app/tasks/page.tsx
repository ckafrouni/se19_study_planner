import { Form, FormField } from '@/components/ui/form'
import {
  PlusCircleIcon,
  SquareCheck,
  Square,
  Pencil,
  Check,
} from 'lucide-react'

type Task = {
  id: number
  task: string
  status: 'TODO' | 'DONE'
  createdAt: string
  updatedAt: string
}

const tasksTable: Task[] = [
  {
    id: 1,
    task: 'Take out the trash',
    status: 'DONE',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: 2,
    task: 'Buy groceries',
    status: 'DONE',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: 3,
    task: 'Pay bills',
    status: 'TODO',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
]

// Modifies the task with the given id in the table
function toggleTaskStatus(taskId: number | null) {
  console.log('toggleTaskStatus', taskId)
  if (!taskId) return
  const task = tasksTable.find((t) => t.id === taskId)
  if (!task) return

  task.status = task.status === 'TODO' ? 'DONE' : 'TODO'
}

const QUERY_KEYS = ['toggle_status', 'edit', 'task_id'] as const

export default function TasksPage({
  query,
}: {
  query: Record<string, string>
}) {
  const { toggle_status, edit, task_id } = query

  const toggleStatus = toggle_status !== 'true'
  const editTask = edit !== 'true'
  const taskId = task_id ? Number(task_id) : null

  console.log('taskId', taskId)
  console.log('toggleStatus', toggleStatus)
  console.log('editTask', editTask)

  if (toggleStatus) {
    toggleTaskStatus(taskId)
  }

  const tasks = tasksTable
  return (
    <div className="container mx-auto flex flex-col gap-4 py-4">
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
        <button type="submit" className="">
          <PlusCircleIcon className="" />
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
  tasks: Task[]
  editTask: boolean
  taskId: number | null
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Your Tasks</h2>
      {tasks.map((task) => (
        <Task key={task.id} task={task} editTask={editTask} taskId={taskId} />
      ))}
    </div>
  )
}

function Task({
  task,
  editTask,
  taskId,
}: {
  task: Task
  editTask: boolean
  taskId: number | null
}) {
  return (
    <div className="flex justify-between text-start">
      <div className="flex">
        <a
          href={`/tasks?toggle_status=true&taskId=${task.id}`}
          aria-disabled={editTask}
        >
          {task.status === 'TODO' && <Square />}
          {task.status === 'DONE' && <SquareCheck />}
        </a>
        <div className="flex-1">
          {editTask && taskId === task.id && (
            <Form action={`/api/tasks/${task.id}`} method="PATCH">
              <FormField
                name="task"
                type="text"
                defaultValue={task.task}
                required
                className="mb-0"
                placeholder="Task"
              />
              <button type="submit" className="">
                <Check />
              </button>
            </Form>
          )}
          {task.task}
        </div>
      </div>
      <a href={`/tasks?edit=true&task_id=${task.id}`} aria-disabled={editTask}>
        <Pencil />
      </a>
    </div>
  )
}

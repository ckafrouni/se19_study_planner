import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { tasksTable, InsertTask, SelectTask } from '../schema'
import { eq } from 'drizzle-orm'

export class TasksDAL {
  private db: LibSQLDatabase

  constructor(db: LibSQLDatabase) {
    this.db = db
  }

  async getAllTasks({ userId }: { userId: number }): Promise<SelectTask[]> {
    const result = await this.db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId))

    return result
  }

  async getTaskById(id: number): Promise<SelectTask | null> {
    const result = await this.db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, id))
      .limit(1)

    return result.length > 0 ? result[0] : null
  }

  async createTask(
    taskData: Omit<InsertTask, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SelectTask> {
    const result = await this.db.insert(tasksTable).values(taskData).returning()

    if (result.length === 0) {
      throw new Error('Failed to create task')
    }

    return result[0]
  }

  async updateTask(
    id: number,
    taskData: Partial<
      Omit<InsertTask, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
    >
  ): Promise<SelectTask | null> {
    const result = await this.db
      .update(tasksTable)
      .set(taskData)
      .where(eq(tasksTable.id, id))
      .returning()

    return result.length > 0 ? result[0] : null
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      return await this.db.transaction(async (tx) => {
        await tx.delete(tasksTable).where(eq(tasksTable.id, id))
        return true
      })
    } catch (error) {
      console.error('Failed to delete task:', error)
      return false
    }
  }
}

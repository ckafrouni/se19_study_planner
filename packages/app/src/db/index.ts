import { drizzle } from 'drizzle-orm/libsql'
import { AuthDAL } from './dal/users'
import { env } from '../../env'
import { TasksDAL } from './dal/tasks'

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL!,
  },
})

export const authDal = new AuthDAL(db)
export const tasksDal = new TasksDAL(db)

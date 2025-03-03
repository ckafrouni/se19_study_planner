import { drizzle } from 'drizzle-orm/libsql'
import { AuthDAL } from './dal/users'
import { env } from '../../env'
import { TasksDAL } from './dal/tasks'

export const db = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL!,
    authToken: env.TURSO_AUTH_TOKEN!,
  },
})

export const authDal = new AuthDAL(db)
export const tasksDal = new TasksDAL(db)

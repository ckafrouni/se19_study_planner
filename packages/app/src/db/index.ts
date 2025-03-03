import { drizzle } from 'drizzle-orm/libsql'
import { AuthDAL } from './dal/users'
import { env } from '../../env'
import { TasksDAL } from './dal/tasks'

console.log(env.TURSO_CONNECTION_URL, env.TURSO_AUTH_TOKEN)
// log pwd
console.log(process.cwd())

export const db = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL!,
    authToken: env.TURSO_AUTH_TOKEN!,
  },
})

export const authDal = new AuthDAL(db)
export const tasksDal = new TasksDAL(db)

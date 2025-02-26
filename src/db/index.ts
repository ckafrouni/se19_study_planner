import { drizzle } from 'drizzle-orm/libsql'
import { AuthDAL } from './dal/users'
import { env } from '../../env'

export const db = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL!,
    authToken: env.TURSO_AUTH_TOKEN!,
  },
})

export const authDal = new AuthDAL(db)

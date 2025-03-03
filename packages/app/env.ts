// import { createEnv } from '@t3-oss/env-core'
// import { z } from 'zod'

// export const env = createEnv({
//   server: z.object({
//     NODE_ENV: z.enum(['development', 'production']).default('development'),
//     DATABASE_URL: z.string(),
//   }),
//   runtimeEnv: {
//     NODE_ENV: process.env.NODE_ENV,
//     DATABASE_URL: process.env.DATABASE_URL,
//   },
// })

import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV!,
}

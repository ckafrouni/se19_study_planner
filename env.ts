// import { createEnv } from '@t3-oss/env-core'
// import { z } from 'zod'

// export const env = createEnv({
//   server: z.object({
//     NODE_ENV: z.enum(['development', 'production']).default('development'),
//     TURSO_CONNECTION_URL: z.string(),
//     TURSO_AUTH_TOKEN: z.string(),
//   }),
//   runtimeEnv: {
//     NODE_ENV: process.env.NODE_ENV,
//     TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
//     TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
//   },
// })

export const env = {
  TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL!,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN!,
  NODE_ENV: process.env.NODE_ENV!,
}

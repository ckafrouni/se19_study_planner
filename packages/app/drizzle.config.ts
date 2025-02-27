/**
 * Drizzle config
 *
 * This file is used to configure the Drizzle ORM to connect to the database
 * and generate the migrations.
 *
 * The connection URL and authentication token are taken from the .env file.
 */

import { defineConfig } from 'drizzle-kit'
import { env } from './env'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
})

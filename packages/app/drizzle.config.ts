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
  verbose: true,
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})

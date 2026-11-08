import { Client } from 'pg'
import { config } from '../config'

const url = config.database.url

const { hostname, pathname } = new URL(url)
const LOCAL_HOSTS = ['localhost', '127.0.0.1', '::1']
if (!LOCAL_HOSTS.includes(hostname)) {
  throw new Error(
    `Refusing to reset a non-local database (host: ${hostname}). This script is for local development only.`,
  )
}

const client = new Client({ connectionString: url })
await client.connect()

try {
  // Drops every table, plus the migrations journal kept by drizzle-kit in the "drizzle" schema.
  await client.query(`
    DROP SCHEMA IF EXISTS public CASCADE;
    DROP SCHEMA IF EXISTS drizzle CASCADE;
    CREATE SCHEMA public;
  `)
  console.log(`Database "${pathname.slice(1)}" on ${hostname} was reset.`)
} finally {
  await client.end()
}

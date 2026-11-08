import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { db } from '../db'
import * as schema from '../db/schema'
import { config } from '../config'

export const auth = betterAuth({
  secret: config.auth.secret,
  baseURL: config.auth.url,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: config.auth.trustedOrigins,
})

import { env, envList } from './helpers/env'

export const config = {
  app: {
    port: Number(env('PORT', '3001')),
  },
  auth: {
    secret: env('BETTER_AUTH_SECRET'),
    url: env('BETTER_AUTH_URL'),
    trustedOrigins: envList('TRUSTED_ORIGINS').map((origin) =>
      origin.replace(/\/+$/, ''),
    ),
  },
  database: {
    url: env('DATABASE_URL'),
  },
}

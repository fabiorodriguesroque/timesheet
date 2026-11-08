import { env, envList } from '../helpers/env'

export default {
  secret: env('BETTER_AUTH_SECRET'),
  url: env('BETTER_AUTH_URL'),
  trustedOrigins: envList('TRUSTED_ORIGINS').map((origin) =>
    origin.replace(/\/+$/, ''),
  ),
}

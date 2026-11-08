import { envList } from '../helpers/env'

export default {
  trustedOrigins: envList('TRUSTED_ORIGINS').map((origin) =>
    origin.replace(/\/+$/, ''),
  ),
}

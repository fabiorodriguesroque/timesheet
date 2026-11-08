import { env } from '../helpers/env'

export default {
  port: Number(env('PORT', '3001')),
}

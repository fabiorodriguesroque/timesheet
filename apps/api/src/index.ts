import { Hono } from 'hono'
import { auth } from './lib/auth'
import { config } from './config'
import { cors } from 'hono/cors'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use(
  '/api/auth/*',
  cors({
    origin: config.auth.trustedOrigins,
    credentials: true,
  }),
)
app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

export default {
  port: config.app.port,
  fetch: app.fetch,
}

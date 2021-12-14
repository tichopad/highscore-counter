import createServer from 'fastify'
import env from 'fastify-env'
import sensible from 'fastify-sensible'
import underPressure from 'under-pressure'
import { envSchema } from './global'
import scoreRoute from './routes/score'

const app = createServer({ logger: false })

const routes = [
  app.register(scoreRoute)
]
const plugins = [
  app.register(env, {
    dotenv: true,
    schema: envSchema
  }),
  app.register(sensible),
  app.register(underPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 100000000,
    maxRssBytes: 100000000,
    maxEventLoopUtilization: 0.98
  })
]

await Promise.all([...plugins, ...routes])

await app.listen(process.env.SERVER_PORT)

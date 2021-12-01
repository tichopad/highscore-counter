import createServer from 'fastify'
import env from 'fastify-env'
import sensible from 'fastify-sensible'
import underPressure from 'under-pressure'
import { envSchema } from './global'
import * as routes from './routes'

const app = createServer({ logger: true })

const registeredRoutes = Object.values(routes).map((routeFunction) => app.register(routeFunction))
const registeredPlugins = [
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

await Promise.all([...registeredPlugins, ...registeredRoutes])

app.get('/', async () => 'hello')

await app.listen(process.env.SERVER_PORT)

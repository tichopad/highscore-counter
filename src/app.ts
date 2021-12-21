import createServer from 'fastify'
import env from 'fastify-env'
import sensible from 'fastify-sensible'
import underPressure from 'under-pressure'
import { envSchema } from './env'
import repository from './plugins/repository'
import gameScoresRoute from './score/routes/gameScores'
import scoreRoute from './score/routes/score'

const app = createServer({ logger: false })

const plugins = [
  app.register(env, {
    dotenv: true,
    schema: envSchema
  }),
  app.register(sensible),
  app.register(underPressure, {
    maxEventLoopDelay: 2000,
    maxEventLoopUtilization: 0.98,
    maxHeapUsedBytes: 1000_000_000
  }),
  app.register(repository)
]
const routes = [
  app.register(scoreRoute),
  app.register(gameScoresRoute)
]

await Promise.all([...plugins, ...routes])

const message = await app.listen(process.env.SERVER_PORT, '0.0.0.0')
console.log(message)

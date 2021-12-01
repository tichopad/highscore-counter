import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function status (app: FastifyInstance, options: FastifyPluginOptions) {
  app.get('/status', async () => options)
}

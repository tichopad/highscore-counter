import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function health (app: FastifyInstance, options: FastifyPluginOptions) {
  app.get('/health', async () => 'alive!')
}

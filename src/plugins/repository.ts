import plugin from 'fastify-plugin'
import { createScoreRepository } from '../score/repository'
import type { ScoreRepository } from '../score/repository'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

type Repository = {
  score: ScoreRepository
}

declare module 'fastify' {
  interface FastifyInstance {
    repository: Repository
  }
}

async function repository (app: FastifyInstance, options: FastifyPluginOptions) {
  const repository: Repository = {
    score: createScoreRepository()
  }
  app.decorate('repository', repository)
}

export default plugin(repository, { name: 'repository' })
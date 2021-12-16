import plugin from 'fastify-plugin'
import type { ScoreEntry } from '../models/score'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

type ScoreRepository = {
  put: (newScoreEntry: ScoreEntry) => Promise<ScoreEntry>;
  getTotalCountByScorerName: (scorerName: string) => Promise<number>;
}

type Repository = {
  score: ScoreRepository
}

declare module 'fastify' {
  interface FastifyInstance {
    repository: Repository
  }
}

function createScoreRepository (): ScoreRepository {
  const DB: Array<ScoreEntry> = []

  return {
    async getTotalCountByScorerName (scorerName: string) {
      return DB.filter((scoreEntry) => scoreEntry.scorerName === scorerName).length
    },
    async put (newScoreEntry) {
      DB.push(newScoreEntry)
      return newScoreEntry
    }
  }
}

async function repository (app: FastifyInstance, options: FastifyPluginOptions) {
  const scoreRepository = createScoreRepository()
  const repository: Repository = {
    score: scoreRepository
  }

  app.decorate('repository', repository)
}

export default plugin(repository, {
  name: 'repository'
})

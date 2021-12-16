import plugin from 'fastify-plugin'
import type { ScoreEntry, ScorePair } from '../models/score'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

type ScoreRepository = {
  put: (newScoreEntry: ScoreEntry) => Promise<ScoreEntry>;
  getTotalCountByScorerName: (scorerName: string) => Promise<number>;
  getTotalScoresByGameName: (gameName: string) => Promise<Array<ScorePair>>
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
    async getTotalScoresByGameName (gameName: string) {
      const totalScoreForEachScorer = DB
        .filter((scoreEntry) => scoreEntry.gameName === gameName)
        .reduce<Record<string, number>>((acc, curr) => {
        const scorerTotal = acc?.[curr.scorerName] ?? 0
        return {
          ...acc,
          [curr.scorerName]: scorerTotal + 1
        }
      }, {})
      const totalScoresByScorerSorted = Object.entries(totalScoreForEachScorer)
        .map(([scorerName, totalScore]): ScorePair => ({
          scorerName,
          totalScore
        }))
        .sort((a, b) => a.totalScore === b.totalScore ? 0 : a.totalScore > b.totalScore ? -1 : 1)
      return totalScoresByScorerSorted
    },
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

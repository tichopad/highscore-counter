import { ScoreEntryInputSchema, ScorePairSchema } from '../models'
import type { ScoreEntryInput, ScorePair } from '../models'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function score (app: FastifyInstance, options: FastifyPluginOptions) {
  const { repository } = app

  app.post<{ Body: ScoreEntryInput, Reply: ScorePair }>(
    '/score',
    {
      schema: {
        body: ScoreEntryInputSchema,
        response: {
          200: ScorePairSchema
        }
      }
    },
    async (request, response) => {
      const savedEntry = await repository.score.put({
        created: new Date(request.body.created),
        gameName: request.body.gameName,
        playerName: request.body.playerName,
        received: new Date()
      })
      const newScore = await repository.score.getGameScoreByPlayerName(savedEntry.gameName, savedEntry.playerName)

      return { ...savedEntry, score: newScore }
    }
  )
}

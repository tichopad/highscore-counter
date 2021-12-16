import { Type } from '@sinclair/typebox'
import { ScorePairSchema } from '../models/score'
import type { Static } from '@sinclair/typebox'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

const ParametersSchema = Type.Object({
  gameName: Type.String()
})
const ReplySchema = Type.Array(ScorePairSchema)

type Parameters = Static<typeof ParametersSchema>
type Reply = Static<typeof ReplySchema>

export default async function gameScores (app: FastifyInstance, options: FastifyPluginOptions) {
  const { repository } = app
  app.get<{ Params: Parameters, Reply: Reply }>(
    '/game/:gameName/scores',
    {
      schema: {
        params: ParametersSchema,
        response: {
          200: ReplySchema
        }
      }
    },
    async (request, response) => {
      return repository.score.getTotalScoresByGameName(request.params.gameName)
    }
  )
}

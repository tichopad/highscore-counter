import { Type } from '@sinclair/typebox'
import { ScoreEntrySchema } from '../models'
import type { ScoreEntry } from '../models'
import type { Static } from '@sinclair/typebox'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

const PostBodySchema = Type.Omit(ScoreEntrySchema, ['receivedTimestamp'])
type PostBody = Static<typeof PostBodySchema>

const PostReplySchema = Type.Intersect([
  ScoreEntrySchema,
  Type.Object({
    score: Type.Number()
  })
])
type PostReply = Static<typeof PostReplySchema>

export default async function score (app: FastifyInstance, options: FastifyPluginOptions) {
  const { repository } = app

  app.post<{ Body: PostBody, Reply: PostReply }>(
    '/score',
    {
      schema: {
        body: PostBodySchema,
        response: {
          200: PostReplySchema
        }
      }
    },
    async (request, response) => {
      const newEntry: ScoreEntry = { ...request.body, receivedTimestamp: Date.now() }
      const savedEntry = await repository.score.put(newEntry)
      const newScore = await repository.score.getScoreByPlayerName(savedEntry.playerName)
      return { ...savedEntry, score: newScore }
    }
  )
}

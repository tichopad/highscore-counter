import { Type } from '@sinclair/typebox'
import { ScoreEntrySchema } from '../models'
import type { ScoreEntry } from '../models'
import type { Static } from '@sinclair/typebox'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

const PostBodySchema = Type.Omit(ScoreEntrySchema, ['receivedAt'])
type PostBody = Static<typeof PostBodySchema>

const PostReplySchema = Type.Intersect([
  ScoreEntrySchema,
  Type.Object({
    newTotalScore: Type.Number()
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
      const newEntry: ScoreEntry = { ...request.body, receivedAt: Date.now() }
      const savedEntry = await repository.score.put(newEntry)
      const newTotalScore = await repository.score.getTotalCountByScorerName(savedEntry.scorerName)
      return { ...savedEntry, newTotalScore }
    }
  )
}

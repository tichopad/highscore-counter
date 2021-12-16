import { Type } from '@sinclair/typebox'
import { ScoreEntrySchema } from '../models/score'
import type { ScoreEntry } from '../models/score'
import type { Static } from '@sinclair/typebox'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

const EntryInputSchema = Type.Omit(ScoreEntrySchema, ['receivedAt'])
type EntryInput = Static<typeof EntryInputSchema>

const PostReplySchema = Type.Intersect([
  ScoreEntrySchema,
  Type.Object({
    newTotalScore: Type.Number()
  })
])
type PostReply = Static<typeof PostReplySchema>

export default async function score (app: FastifyInstance, options: FastifyPluginOptions) {
  const { repository } = app

  app.post<{ Body: EntryInput, Reply: PostReply }>(
    '/score',
    {
      schema: {
        body: EntryInputSchema,
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

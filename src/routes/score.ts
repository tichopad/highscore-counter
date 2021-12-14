import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

const ScoreInput = Type.Object({
  author: Type.String(),
  created: Type.Number()
})
const ScoreInputResponse = Type.Object({
  author: Type.String(),
  score: Type.Number()
})

type ScoreInputType = Static<typeof ScoreInput>
type ScoreInputResponseType = Static<typeof ScoreInputResponse>
type ScoreEntry = ScoreInputType & {
  received: number;
}

const DB: Array<ScoreEntry> = []

export default async function score (app: FastifyInstance, options: FastifyPluginOptions) {
  app.post<{ Body: ScoreInputType, Reply: ScoreInputResponseType }>(
    '/score',
    {
      schema: {
        body: ScoreInput,
        response: {
          200: ScoreInputResponse
        }
      }
    },
    async (request, response) => {
      const scoreInput = request.body
      DB.push({ ...scoreInput, received: Date.now() })
      const scoreTotal = DB.filter((scoreEntry) => scoreEntry.author === scoreInput.author).length

      return {
        author: scoreInput.author,
        score: scoreTotal
      }
    }
  )
}

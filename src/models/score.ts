import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export const ScoreEntrySchema = Type.Object({
  gameName: Type.String(),
  receivedAt: Type.Number(),
  scoredAt: Type.Number(),
  scorerName: Type.String()
})

export type ScoreEntry = Static<typeof ScoreEntrySchema>

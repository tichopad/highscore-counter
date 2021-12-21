import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

export const ScoreEntryInputSchema = Type.Object({
  gameName: Type.String(),
  playerName: Type.String(),
  created: Type.Number()
})
export type ScoreEntryInput = Static<typeof ScoreEntryInputSchema>

export const ScorePairSchema = Type.Object({
  playerName: Type.String(),
  score: Type.Number()
})
export type ScorePair = Static<typeof ScorePairSchema>

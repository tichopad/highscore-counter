import { Type } from '@sinclair/typebox'
import type { Static } from '@sinclair/typebox'

const ScoreSchema = Type.Number()
export type Score = Static<typeof ScoreSchema>

export const ScoreEntrySchema = Type.Object({
  gameName: Type.String(),
  playerName: Type.String(),
  receivedTimestamp: Type.Number(),
  createdTimestamp: Type.Number()
})
export type ScoreEntry = Static<typeof ScoreEntrySchema>

export const ScorePairSchema = Type.Object({
  playerName: Type.String(),
  score: ScoreSchema
})
export type ScorePair = Static<typeof ScorePairSchema>

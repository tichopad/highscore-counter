import type { ScorePair } from './models'
import type { Prisma, PrismaClient, ScoreEntry } from '@prisma/client'

type Database = PrismaClient

const put = (db: Database) => async (newScoreEntry: Prisma.ScoreEntryCreateInput): Promise<ScoreEntry> => {
  return db.scoreEntry.create({
    data: newScoreEntry
  })
}

const getGameScoreByPlayerName = (db: Database) => (gameName: string, playerName: string): Promise<number> => {
  return db.scoreEntry.count({ where: { gameName, playerName } })
}

const getScoresByGameName = (db: Database) => async (gameName: string): Promise<Array<ScorePair>> => {
  const aggregatedScoreEntries = await db.scoreEntry.groupBy({ _count: true, by: ['playerName'], where: { gameName } })
  return aggregatedScoreEntries.map((aggregateEntry): ScorePair => ({
    playerName: aggregateEntry.playerName,
    score: aggregateEntry._count
  }))
}

export function createScoreRepository (db: Database) {
  return {
    getGameScoreByPlayerName: getGameScoreByPlayerName(db),
    getScoresByGameName: getScoresByGameName(db),
    put: put(db)
  }
}

export type ScoreRepository = ReturnType<typeof createScoreRepository>

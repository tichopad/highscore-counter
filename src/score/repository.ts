import type { ScoreEntry, ScorePair } from './models'

type Database = Array<ScoreEntry>

const put = (db: Database) => async (newScoreEntry: ScoreEntry): Promise<ScoreEntry> => {
  db.push(newScoreEntry)
  return newScoreEntry
}

const getScoreByPlayerName = (db: Database) => async (playerName: string): Promise<number> => {
  return db.filter((scoreEntry) => scoreEntry.playerName === playerName).length
}

const getScoresByGameName = (db: Database) => async (gameName: string): Promise<Array<ScorePair>> => {
  const scoresIndexedByPlayerNames = db
    .filter((scoreEntry) => scoreEntry.gameName === gameName)
    .reduce<Record<string, number>>((result, { playerName }) => {
    const scorerTotal = result?.[playerName] ?? 0
    return { ...result, [playerName]: scorerTotal + 1 }
  }, {})
  const sortedScoresForEachPlayer = Object.entries(scoresIndexedByPlayerNames)
    .map(([playerName, score]): ScorePair => ({ playerName, score }))
    .sort((a, b) => a.score === b.score ? 0 : a.score > b.score ? -1 : 1)
  return sortedScoresForEachPlayer
}

export function createScoreRepository () {
  const db: Database = []

  return {
    getScoreByPlayerName: getScoreByPlayerName(db),
    getScoresByGameName: getScoresByGameName(db),
    put: put(db)
  }
}

export type ScoreRepository = ReturnType<typeof createScoreRepository>

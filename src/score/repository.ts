import type { ScoreEntry, ScorePair } from './models'

type Database = Array<ScoreEntry>

const put = (db: Database) => async (newScoreEntry: ScoreEntry): Promise<ScoreEntry> => {
  db.push(newScoreEntry)
  return newScoreEntry
}

const getTotalCountByScorerName = (db: Database) => async (scorerName: string): Promise<number> => {
  return db.filter((scoreEntry) => scoreEntry.scorerName === scorerName).length
}

const getTotalScoresByGameName = (db: Database) => async (gameName: string): Promise<Array<ScorePair>> => {
  const totalScoreForEachScorer = db
    .filter((scoreEntry) => scoreEntry.gameName === gameName)
    .reduce<Record<string, number>>((acc, curr) => {
    const scorerTotal = acc?.[curr.scorerName] ?? 0
    return {
      ...acc,
      [curr.scorerName]: scorerTotal + 1
    }
  }, {})
  const totalScoresByScorerSorted = Object.entries(totalScoreForEachScorer)
    .map(([scorerName, totalScore]): ScorePair => ({
      scorerName,
      totalScore
    }))
    .sort((a, b) => a.totalScore === b.totalScore ? 0 : a.totalScore > b.totalScore ? -1 : 1)
  return totalScoresByScorerSorted
}

export function createScoreRepository () {
  const db: Database = []

  return {
    getTotalCountByScorerName: getTotalCountByScorerName(db),
    getTotalScoresByGameName: getTotalScoresByGameName(db),
    put: put(db)
  }
}

export type ScoreRepository = ReturnType<typeof createScoreRepository>

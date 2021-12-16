import type { ScoreEntry, ScorePair } from './models'

export type ScoreRepository = {
  put: (newScoreEntry: ScoreEntry) => Promise<ScoreEntry>;
  getTotalCountByScorerName: (scorerName: string) => Promise<number>;
  getTotalScoresByGameName: (gameName: string) => Promise<Array<ScorePair>>
}

export function createScoreRepository (): ScoreRepository {
  const DB: Array<ScoreEntry> = []

  return {
    async getTotalScoresByGameName (gameName: string) {
      const totalScoreForEachScorer = DB
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
    },
    async getTotalCountByScorerName (scorerName: string) {
      return DB.filter((scoreEntry) => scoreEntry.scorerName === scorerName).length
    },
    async put (newScoreEntry) {
      DB.push(newScoreEntry)
      return newScoreEntry
    }
  }
}

export interface IQuizAttemptPerformance {
  accuracyRate: number
  averageTimePerQuestion: number
  scorePerMinute: number
}

export interface IQuizAttemptUserInfo {
  username: string
  avatar?: string
}

export interface IQuizAttemptQuizInfo {
  title: string
  difficulty: string
  duration: number
}

export interface IQuizAttemptRankings {
  scoreRank?: number
  timeRank?: number
  accuracyRank?: number
}
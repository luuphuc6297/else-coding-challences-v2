export interface IQuestionMetadata {
  imageUrl?: string
  audioUrl?: string
  videoUrl?: string
  explanation?: string
}

export interface IQuestionStatistics {
  timesUsed: number
  correctAnswerRate: number
  averageTimeSpent: number
}
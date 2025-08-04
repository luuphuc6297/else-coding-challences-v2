import {QuizSessionStatus} from '@modules/quiz-session/repository/entities/quiz-session.entity'

export interface IQuizParticipant {
  userId: string
  username: string
  avatar?: string
  socketId: string
  status: 'waiting' | 'ready' | 'playing' | 'disconnected'
  joinedAt: Date
  lastSeenAt: Date
  reconnectAttempts: number
}

export interface IQuizSessionState {
  quizId: string
  sessionId: string
  status: QuizSessionStatus
  participants: Map<string, IQuizParticipant>
  currentQuestionIndex: number
  questionStartTime?: Date
  questionEndTime?: Date
  isActive: boolean
  createdAt: Date
}

export interface ISubmittedAnswer {
  questionId: string
  answer: string
  submittedAt: Date
  timeSpent: number
  points: number
  isCorrect: boolean
}

export interface IQuizScore {
  userId: string
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
  accuracyRate: number
  averageTimePerQuestion: number
  scorePerMinute: number
  rank: number
}

export interface ILeaderboardRanking {
  userId: string
  username: string
  avatar?: string
  rank: number
  stats: {
    totalScore: number
    correctAnswers: number
    totalQuestions: number
    totalTimeSpent: number
  }
  performance: {
    accuracyRate: number
    averageTimePerQuestion: number
    scorePerMinute: number
  }
  lastAttemptAt: Date
}

export interface IQuizEvent {
  type: string
  quizId: string
  userId?: string
  timestamp: Date
  data: Record<string, unknown>
}

export interface IQuestionResult {
  questionId: string
  correctAnswer: string
  userAnswer: string
  isCorrect: boolean
  points: number
  timeSpent: number
  explanation?: string
}

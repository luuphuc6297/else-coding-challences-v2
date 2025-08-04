export interface IUserPreferences {
  notifications: boolean
  soundEnabled: boolean
  darkMode: boolean
}

export interface IUserProfile {
  avatar?: string
  timezone?: string
  language?: string
  preferences?: IUserPreferences
}

export interface IUserStatistics {
  totalQuizzesTaken: number
  averageScore: number
  totalPoints: number
  rank: number
  streakDays: number
  bestCategories: string[]
}

export interface IUserPermissions {
  roles: string[]
  canCreateQuiz: boolean
  isAdmin: boolean
}
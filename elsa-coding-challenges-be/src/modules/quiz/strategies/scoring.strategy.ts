import {QUIZ_SCORING} from '../constants/quiz.constant'

export interface IScoringStrategy {
  calculatePoints(timeSpent: number, timeLimit: number, basePoints: number): number
}

export class TimeBasedScoringStrategy implements IScoringStrategy {
  calculatePoints(timeSpent: number, timeLimit: number, basePoints: number): number {
    if (timeSpent >= timeLimit) {
      return 0
    }

    const timeRatio = Math.max(0, (timeLimit - timeSpent) / timeLimit)
    const timeBonus = Math.floor(timeRatio * QUIZ_SCORING.MAX_TIME_BONUS)

    return basePoints + timeBonus
  }
}

export class StandardScoringStrategy implements IScoringStrategy {
  calculatePoints(timeSpent: number, timeLimit: number, basePoints: number): number {
    return timeSpent < timeLimit ? basePoints : 0
  }
}

export class AccuracyScoringStrategy implements IScoringStrategy {
  calculatePoints(timeSpent: number, timeLimit: number, basePoints: number): number {
    if (timeSpent >= timeLimit) {
      return 0
    }

    const efficiency = Math.max(0, (timeLimit - timeSpent) / timeLimit)
    const multiplier = 1 + efficiency * QUIZ_SCORING.TIME_BONUS_MULTIPLIER

    return Math.floor(basePoints * multiplier)
  }
}

export class ScoringStrategyFactory {
  static create(strategyType: 'time_based' | 'standard' | 'accuracy'): IScoringStrategy {
    switch (strategyType) {
      case 'time_based':
        return new TimeBasedScoringStrategy()
      case 'accuracy':
        return new AccuracyScoringStrategy()
      case 'standard':
      default:
        return new StandardScoringStrategy()
    }
  }
}

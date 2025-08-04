import {Injectable, Logger} from '@nestjs/common'
import {QuizEventObserver} from './quiz-event.observer'
import {LeaderboardService} from '@modules/leaderboard/services/leaderboard.service'
import {RedisPubSubService} from '@infras/redis/services/redis.pub-sub.service'
import {IQuizEvent, ILeaderboardRanking} from '../interfaces/quiz.interface'
import {QUIZ_CHANNELS, QUIZ_EVENTS} from '../constants/quiz.constant'

@Injectable()
export class LeaderboardObserver extends QuizEventObserver {
  private readonly logger = new Logger(LeaderboardObserver.name)

  constructor(
    private readonly leaderboardService: LeaderboardService,
    private readonly redisPubSubService: RedisPubSubService
  ) {
    super()
  }

  async update(event: IQuizEvent): Promise<void> {
    try {
      if (event.type === QUIZ_EVENTS.ANSWER_SUBMITTED) {
        await this.handleAnswerSubmitted(event)
      } else if (event.type === QUIZ_EVENTS.QUIZ_COMPLETED) {
        await this.handleQuizCompleted(event)
      }
    } catch (error) {
      this.logger.error(`Failed to update leaderboard for event ${event.type}:`, error)
    }
  }

  private async handleAnswerSubmitted(event: IQuizEvent): Promise<void> {
    const {quizId, userId, data} = event
    const {points, isCorrect, timeSpent} = data as {
      points: number
      isCorrect: boolean
      timeSpent: number
    }

    const leaderboard = await this.leaderboardService.findOne({quizId})
    if (!leaderboard) {
      this.logger.warn(`Leaderboard not found for quiz ${quizId}`)
      return
    }

    const existingRankingIndex = leaderboard.rankings.findIndex((r) => r.userId === userId)

    if (existingRankingIndex >= 0) {
      const ranking = leaderboard.rankings[existingRankingIndex]
      ranking.stats.totalScore += points
      ranking.stats.totalTimeSpent += timeSpent

      if (isCorrect) {
        ranking.stats.correctAnswers += 1
      }

      ranking.stats.totalQuestions += 1
      ranking.performance.accuracyRate = (ranking.stats.correctAnswers / ranking.stats.totalQuestions) * 100
      ranking.performance.averageTimePerQuestion = ranking.stats.totalTimeSpent / ranking.stats.totalQuestions
      ranking.performance.scorePerMinute = ranking.stats.totalScore / (ranking.stats.totalTimeSpent / 60000) || 0
      ranking.lastAttemptAt = new Date()
    }

    leaderboard.rankings.sort((a, b) => b.stats.totalScore - a.stats.totalScore)

    leaderboard.rankings.forEach((ranking, index) => {
      ranking.rank = index + 1
    })

    leaderboard.lastUpdatedAt = new Date()

    await this.leaderboardService.update(
      {quizId},
      {
        rankings: leaderboard.rankings,
        lastUpdatedAt: leaderboard.lastUpdatedAt,
      }
    )

    await this.publishLeaderboardUpdate(quizId, leaderboard.rankings)
  }

  private async handleQuizCompleted(event: IQuizEvent): Promise<void> {
    const {quizId} = event

    const leaderboard = await this.leaderboardService.findOne({quizId})
    if (!leaderboard) {
      return
    }

    await this.publishLeaderboardUpdate(quizId, leaderboard.rankings)
    this.logger.log(`Final leaderboard published for quiz ${quizId}`)
  }

  private async publishLeaderboardUpdate(quizId: string, rankings: ILeaderboardRanking[]): Promise<void> {
    const channel = `${QUIZ_CHANNELS.LEADERBOARD}${quizId}`
    const message = JSON.stringify({
      type: QUIZ_EVENTS.LEADERBOARD_UPDATED,
      quizId,
      rankings: rankings.slice(0, 20),
      timestamp: new Date().toISOString(),
    })

    await this.redisPubSubService.publish(channel, message)
    this.logger.debug(`Published leaderboard update for quiz ${quizId}`)
  }
}

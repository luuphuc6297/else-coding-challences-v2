import {Injectable, Logger} from '@nestjs/common'
import {QuizStateManager} from '../../managers/quiz-state.manager'
import {QuestionService} from '@modules/question/services/question.service'
import {QuizSessionService} from '@modules/quiz-session/services/quiz-session.service'
import {SubmitAnswerCommand} from '../quiz.commands'
import {IScoringStrategy, ScoringStrategyFactory} from '../../strategies/scoring.strategy'
import {IQuestionResult} from '../../interfaces/quiz.interface'
import {QUIZ_SCORING} from '../../constants/quiz.constant'

@Injectable()
export class SubmitAnswerHandler {
  private readonly logger = new Logger(SubmitAnswerHandler.name)
  private readonly scoringStrategy: IScoringStrategy

  constructor(
    private readonly quizStateManager: QuizStateManager,
    private readonly questionService: QuestionService,
    private readonly quizSessionService: QuizSessionService
  ) {
    this.scoringStrategy = ScoringStrategyFactory.create('time_based')
  }

  async execute(command: SubmitAnswerCommand): Promise<IQuestionResult> {
    const {sessionId, userId, submittedAnswer} = command

    const session = this.quizStateManager.getSession(sessionId)
    if (!session) {
      throw new Error('Quiz session not found')
    }

    const participant = session.participants.get(userId)
    if (!participant) {
      throw new Error('Participant not found in session')
    }

    const question = await this.questionService.findOne({_id: submittedAnswer.questionId})
    if (!question) {
      throw new Error('Question not found')
    }

    const isCorrect = submittedAnswer.answer === question.correctAnswer
    let points = 0

    if (isCorrect) {
      points = this.scoringStrategy.calculatePoints(
        submittedAnswer.timeSpent,
        question.timeLimit * 1000,
        question.points || QUIZ_SCORING.BASE_POINTS_CORRECT
      )
    } else {
      points = QUIZ_SCORING.PENALTY_WRONG_ANSWER
    }

    const result: IQuestionResult = {
      questionId: submittedAnswer.questionId,
      correctAnswer: question.correctAnswer,
      userAnswer: submittedAnswer.answer,
      isCorrect,
      points,
      timeSpent: submittedAnswer.timeSpent,
      explanation: question.metadata?.explanation,
    }

    const quizSession = await this.quizSessionService.findOne({_id: sessionId})
    if (quizSession) {
      const currentAnswers = quizSession.submittedAnswers || new Map()
      currentAnswers.set(submittedAnswer.questionId, {
        answer: submittedAnswer.answer,
        timeSpent: submittedAnswer.timeSpent,
        points,
        isCorrect,
      })

      const totalScore = Array.from(currentAnswers.values()).reduce((sum, answer) => sum + answer.points, 0)

      const correctAnswers = Array.from(currentAnswers.values()).filter((answer) => answer.isCorrect).length

      const updated = await this.quizSessionService.update(
        {_id: sessionId},
        {
          submittedAnswers: currentAnswers,
          progress: {
            completedQuestions: currentAnswers.size,
            currentScore: totalScore,
            remainingTime: Math.max(0, quizSession.progress?.remainingTime || 0),
          },
        }
      )

      if (!updated) {
        this.logger.warn(`Failed to update quiz session ${sessionId}`)
      }
    }

    this.logger.log(
      `User ${userId} submitted answer for question ${submittedAnswer.questionId}: ` +
        `${isCorrect ? 'correct' : 'incorrect'}, earned ${points} points`
    )

    return result
  }
}

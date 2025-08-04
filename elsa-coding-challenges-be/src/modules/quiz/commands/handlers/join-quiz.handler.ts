import {Injectable, Logger} from '@nestjs/common'
import {QuizStateManager} from '../../managers/quiz-state.manager'
import {QuizService} from '../../services/quiz.service'
import {QuizSessionService} from '@modules/quiz-session/services/quiz-session.service'
import {JoinQuizCommand} from '../quiz.commands'
import {IQuizSessionState} from '../../interfaces/quiz.interface'
import {QuizSessionStatus} from '@modules/quiz-session/repository/entities/quiz-session.entity'
import {DatabaseDefaultObjectId} from '@infras/database/constants/database.function.constant'

@Injectable()
export class JoinQuizHandler {
  private readonly logger = new Logger(JoinQuizHandler.name)

  constructor(
    private readonly quizStateManager: QuizStateManager,
    private readonly quizService: QuizService,
    private readonly quizSessionService: QuizSessionService
  ) {}

  async execute(command: JoinQuizCommand): Promise<{sessionId: string; session: IQuizSessionState}> {
    const {quizId, participant, socketId} = command

    const quiz = await this.quizService.findOne({_id: quizId})
    if (!quiz) {
      throw new Error('Quiz not found')
    }

    if (quiz.status !== 'PUBLISHED') {
      throw new Error('Quiz is not published')
    }

    const now = new Date()
    if (now < quiz.startTime || now > quiz.endTime) {
      throw new Error('Quiz is not active')
    }

    let existingSession = await this.quizSessionService.findOne({
      quizId,
      userId: participant.userId,
      status: {$in: [QuizSessionStatus.WAITING, QuizSessionStatus.IN_PROGRESS]},
    })

    let sessionId: string
    let session: IQuizSessionState

    if (existingSession) {
      sessionId = existingSession._id.toString()
      let existingMemorySession = this.quizStateManager.getSession(sessionId)

      if (!existingMemorySession) {
        session = this.quizStateManager.createSession(quizId, sessionId)
      } else {
        session = existingMemorySession
      }
    } else {
      sessionId = DatabaseDefaultObjectId().toString()
      session = this.quizStateManager.createSession(quizId, sessionId)

      await this.quizSessionService.create({
        _id: sessionId,
        quizId,
        userId: participant.userId,
        status: QuizSessionStatus.WAITING,
        startTime: new Date(),
        settings: {
          timeLimit: quiz.timeLimit,
          shuffleQuestions: false,
          shuffleOptions: false,
        },
        events: [],
        currentQuestionIndex: 0,
        submittedAnswers: new Map(),
        progress: {
          completedQuestions: 0,
          currentScore: 0,
          remainingTime: quiz.timeLimit,
        },
      })
    }

    const participantWithSocket = {
      ...participant,
      socketId,
      status: 'waiting' as const,
      joinedAt: new Date(),
      lastSeenAt: new Date(),
      reconnectAttempts: 0,
    }

    const added = this.quizStateManager.addParticipant(sessionId, participantWithSocket)
    if (!added) {
      throw new Error('Failed to add participant to session')
    }

    this.logger.log(`User ${participant.userId} joined quiz ${quizId} with session ${sessionId}`)

    return {sessionId, session}
  }
}

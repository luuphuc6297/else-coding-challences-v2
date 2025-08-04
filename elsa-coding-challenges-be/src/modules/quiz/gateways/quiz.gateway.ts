import {Logger, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import {Server, Socket} from 'socket.io'
import {IQuizGateway} from './interfaces/gateway.interface'
import {QuizStateManager} from '../managers/quiz-state.manager'
import {JoinQuizHandler} from '../commands/handlers/join-quiz.handler'
import {SubmitAnswerHandler} from '../commands/handlers/submit-answer.handler'
import {LeaderboardObserver} from '../observers/leaderboard.observer'
import {RedisPubSubService} from '@infras/redis/services/redis.pub-sub.service'
import {JoinQuizDto, ReconnectQuizDto} from '../dtos/join-quiz.dto'
import {ParticipantReadyDto} from '../dtos/participant-ready.dto'
import {SubmitAnswerDto} from '../dtos/submit-answer.dto'
import {JoinQuizCommand, SubmitAnswerCommand} from '../commands/quiz.commands'
import {IQuizEvent, IQuizParticipant} from '../interfaces/quiz.interface'
import {QUIZ_CHANNELS, QUIZ_EVENTS, QUIZ_LIMITS} from '../constants/quiz.constant'

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/quiz',
})
@UsePipes(new ValidationPipe({transform: true}))
export class QuizGateway implements IQuizGateway, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private readonly logger = new Logger(QuizGateway.name)

  constructor(
    private readonly quizStateManager: QuizStateManager,
    private readonly joinQuizHandler: JoinQuizHandler,
    private readonly submitAnswerHandler: SubmitAnswerHandler,
    private readonly leaderboardObserver: LeaderboardObserver,
    private readonly redisPubSubService: RedisPubSubService
  ) {}

  afterInit(): void {
    this.logger.log('Quiz WebSocket Gateway initialized')
    this.subscribeToRedisEvents()
  }

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    this.logger.debug(`Client connected: ${client.id}`)

    client.emit('connected', {
      message: 'Connected to quiz server',
      clientId: client.id,
    })
  }

  async handleDisconnect(@ConnectedSocket() client: Socket): Promise<void> {
    this.logger.debug(`Client disconnected: ${client.id}`)

    const sessions = this.quizStateManager.getAllActiveSessions()
    for (const session of sessions) {
      const participant = Array.from(session.participants.values()).find((p) => p.socketId === client.id)

      if (participant) {
        this.quizStateManager.updateParticipantStatus(session.sessionId, participant.userId, 'disconnected')

        await this.emitToSession(session.sessionId, QUIZ_EVENTS.PARTICIPANT_DISCONNECTED, {
          userId: participant.userId,
          username: participant.username,
        })
      }
    }
  }

  @SubscribeMessage('join_quiz')
  async handleJoinQuiz(@ConnectedSocket() client: Socket, @MessageBody() payload: JoinQuizDto): Promise<void> {
    try {
      const participant: IQuizParticipant = {
        userId: payload.userId,
        username: payload.username,
        avatar: payload.avatar,
        socketId: client.id,
        status: 'waiting',
        joinedAt: new Date(),
        lastSeenAt: new Date(),
        reconnectAttempts: 0,
      }

      const command = new JoinQuizCommand(payload.quizId, participant, client.id)
      const {sessionId, session} = await this.joinQuizHandler.execute(command)

      await client.join(`session:${sessionId}`)

      client.emit('quiz_joined', {
        sessionId,
        quizId: payload.quizId,
        participantCount: session.participants.size,
      })

      await this.emitToSession(sessionId, QUIZ_EVENTS.PARTICIPANT_JOINED, {
        userId: payload.userId,
        username: payload.username,
        participantCount: session.participants.size,
      })

      this.logger.log(`User ${payload.userId} joined quiz ${payload.quizId}`)
    } catch (error) {
      this.logger.error(`Failed to join quiz:`, error)
      client.emit('error', {
        message: error.message || 'Failed to join quiz',
        code: 'JOIN_QUIZ_ERROR',
      })
    }
  }

  @SubscribeMessage('participant_ready')
  async handleParticipantReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ParticipantReadyDto
  ): Promise<void> {
    try {
      const updated = this.quizStateManager.updateParticipantStatus(payload.sessionId, payload.userId, 'ready')

      if (!updated) {
        throw new Error('Failed to update participant status')
      }

      await this.emitToSession(payload.sessionId, QUIZ_EVENTS.PARTICIPANT_READY, {
        userId: payload.userId,
        username: payload.username,
      })

      const session = this.quizStateManager.getSession(payload.sessionId)
      const readyCount =
        session?.participants && Array.from(session.participants.values()).filter((p) => p.status === 'ready').length

      if (readyCount && readyCount >= QUIZ_LIMITS.MIN_PARTICIPANTS) {
        await this.startQuiz(payload.sessionId)
      }
    } catch (error) {
      this.logger.error(`Failed to mark participant ready:`, error)
      client.emit('error', {
        message: error.message || 'Failed to mark as ready',
        code: 'PARTICIPANT_READY_ERROR',
      })
    }
  }

  @SubscribeMessage('submit_answer')
  async handleSubmitAnswer(@ConnectedSocket() client: Socket, @MessageBody() payload: SubmitAnswerDto): Promise<void> {
    try {
      const submittedAnswer = {
        questionId: payload.questionId,
        answer: payload.answer,
        submittedAt: payload.submittedAt,
        timeSpent: payload.timeSpent,
        points: 0,
        isCorrect: false,
      }

      const command = new SubmitAnswerCommand(payload.sessionId, payload.userId, submittedAnswer)
      const result = await this.submitAnswerHandler.execute(command)

      client.emit('answer_result', {
        questionId: result.questionId,
        isCorrect: result.isCorrect,
        points: result.points,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation,
      })

      const event: IQuizEvent = {
        type: QUIZ_EVENTS.ANSWER_SUBMITTED,
        quizId: this.quizStateManager.getSession(payload.sessionId)?.quizId || '',
        userId: payload.userId,
        timestamp: new Date(),
        data: {
          questionId: result.questionId,
          points: result.points,
          isCorrect: result.isCorrect,
          timeSpent: result.timeSpent,
        },
      }

      await this.leaderboardObserver.update(event)
    } catch (error) {
      this.logger.error(`Failed to submit answer:`, error)
      client.emit('error', {
        message: error.message || 'Failed to submit answer',
        code: 'SUBMIT_ANSWER_ERROR',
      })
    }
  }

  @SubscribeMessage('reconnect_quiz')
  async handleReconnect(@ConnectedSocket() client: Socket, @MessageBody() payload: ReconnectQuizDto): Promise<void> {
    try {
      const session = this.quizStateManager.getSession(payload.sessionId)
      if (!session) {
        throw new Error('Session not found')
      }

      const participant = session.participants.get(payload.userId)
      if (!participant) {
        throw new Error('Participant not found in session')
      }

      if (participant.reconnectAttempts >= QUIZ_LIMITS.MAX_RECONNECT_ATTEMPTS) {
        throw new Error('Maximum reconnection attempts exceeded')
      }

      participant.socketId = client.id
      participant.status = 'playing'
      participant.lastSeenAt = new Date()
      participant.reconnectAttempts += 1

      await client.join(`session:${payload.sessionId}`)

      client.emit('reconnected', {
        sessionId: payload.sessionId,
        currentQuestionIndex: session.currentQuestionIndex,
        remainingTime: session.questionEndTime ? Math.max(0, session.questionEndTime.getTime() - Date.now()) : null,
      })

      await this.emitToSession(payload.sessionId, QUIZ_EVENTS.PARTICIPANT_RECONNECTED, {
        userId: payload.userId,
      })
    } catch (error) {
      this.logger.error(`Failed to reconnect:`, error)
      client.emit('error', {
        message: error.message || 'Failed to reconnect',
        code: 'RECONNECT_ERROR',
      })
    }
  }

  private async startQuiz(sessionId: string): Promise<void> {
    this.quizStateManager.updateSessionStatus(sessionId, 'IN_PROGRESS' as any)

    await this.emitToSession(sessionId, QUIZ_EVENTS.QUIZ_STARTED, {
      sessionId,
      message: 'Quiz has started!',
    })

    this.logger.log(`Quiz session ${sessionId} started`)
  }

  private async emitToSession(sessionId: string, event: string, data: unknown): Promise<void> {
    this.server.to(`session:${sessionId}`).emit(event, data)
  }

  private subscribeToRedisEvents(): void {
    this.redisPubSubService.subscribe({
      channel: `${QUIZ_CHANNELS.GLOBAL}*`,
      handler: (channel: string, message: string) => {
        try {
          const data = JSON.parse(message)
          this.server.emit(data.type, data)
        } catch (error) {
          this.logger.error('Failed to parse Redis message:', error)
        }
      },
    })
  }
}

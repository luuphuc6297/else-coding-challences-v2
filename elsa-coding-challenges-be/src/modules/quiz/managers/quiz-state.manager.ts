import {Injectable, Logger} from '@nestjs/common'
import {QuizSessionStatus} from '@modules/quiz-session/repository/entities/quiz-session.entity'
import {IQuizParticipant, IQuizSessionState} from '../interfaces/quiz.interface'
import {QUIZ_LIMITS} from '../constants/quiz.constant'

@Injectable()
export class QuizStateManager {
  private readonly logger = new Logger(QuizStateManager.name)
  private readonly sessions = new Map<string, IQuizSessionState>()

  createSession(quizId: string, sessionId: string): IQuizSessionState {
    const session: IQuizSessionState = {
      quizId,
      sessionId,
      status: QuizSessionStatus.WAITING,
      participants: new Map(),
      currentQuestionIndex: 0,
      isActive: true,
      createdAt: new Date(),
    }

    this.sessions.set(sessionId, session)
    this.logger.debug(`Created quiz session ${sessionId} for quiz ${quizId}`)

    return session
  }

  getSession(sessionId: string): IQuizSessionState | undefined {
    return this.sessions.get(sessionId)
  }

  addParticipant(sessionId: string, participant: IQuizParticipant): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return false
    }

    if (session.participants.size >= QUIZ_LIMITS.MAX_PARTICIPANTS) {
      this.logger.warn(`Session ${sessionId} has reached maximum participants`)
      return false
    }

    session.participants.set(participant.userId, participant)
    this.logger.debug(`Added participant ${participant.userId} to session ${sessionId}`)

    return true
  }

  removeParticipant(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return false
    }

    const removed = session.participants.delete(userId)
    if (removed) {
      this.logger.debug(`Removed participant ${userId} from session ${sessionId}`)
    }

    return removed
  }

  updateParticipantStatus(sessionId: string, userId: string, status: IQuizParticipant['status']): boolean {
    const session = this.sessions.get(sessionId)
    const participant = session?.participants.get(userId)

    if (!participant) {
      return false
    }

    participant.status = status
    participant.lastSeenAt = new Date()

    return true
  }

  updateSessionStatus(sessionId: string, status: QuizSessionStatus): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return false
    }

    session.status = status
    this.logger.debug(`Updated session ${sessionId} status to ${status}`)

    return true
  }

  startQuestion(sessionId: string, questionIndex: number): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return false
    }

    session.currentQuestionIndex = questionIndex
    session.questionStartTime = new Date()
    session.questionEndTime = undefined

    return true
  }

  endQuestion(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return false
    }

    session.questionEndTime = new Date()

    return true
  }

  getActiveParticipants(sessionId: string): IQuizParticipant[] {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return []
    }

    return Array.from(session.participants.values()).filter((p) => p.status !== 'disconnected')
  }

  getParticipantCount(sessionId: string): number {
    const session = this.sessions.get(sessionId)
    return session?.participants.size ?? 0
  }

  destroySession(sessionId: string): boolean {
    const deleted = this.sessions.delete(sessionId)
    if (deleted) {
      this.logger.debug(`Destroyed session ${sessionId}`)
    }

    return deleted
  }

  isSessionActive(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    return session?.isActive ?? false
  }

  getAllActiveSessions(): IQuizSessionState[] {
    return Array.from(this.sessions.values()).filter((session) => session.isActive)
  }
}

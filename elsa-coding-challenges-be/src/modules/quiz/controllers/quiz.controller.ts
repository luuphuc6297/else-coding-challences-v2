import {Controller, Get, Post, Body, Param, Query, UseGuards, HttpStatus} from '@nestjs/common'
import {ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery} from '@nestjs/swagger'
import {QuizService} from '../services/quiz.service'
import {QuizStateManager} from '../managers/quiz-state.manager'
import {LeaderboardService} from '@modules/leaderboard/services/leaderboard.service'
import {QuizSessionService} from '@modules/quiz-session/services/quiz-session.service'
import {Response} from '@infras/response/decorators/response.decorator'
import {JoinQuizDto} from '../dtos/join-quiz.dto'
import {ENUM_PAGINATION_ORDER_DIRECTION_TYPE} from '@infras/pagination/constants/pagination.enum.constant'

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly quizStateManager: QuizStateManager,
    private readonly leaderboardService: LeaderboardService,
    private readonly quizSessionService: QuizSessionService
  ) {}

  @Get('active')
  @ApiOperation({summary: 'Get all active quizzes'})
  @ApiResponse({status: HttpStatus.OK, description: 'Active quizzes retrieved successfully'})
  @Response('quiz.activeList')
  async getActiveQuizzes(): Promise<any[]> {
    const now = new Date()
    const activeQuizzes = await this.quizService.findAll({
      status: 'PUBLISHED',
      startTime: {$lte: now},
      endTime: {$gte: now},
    })

    return activeQuizzes.map((quiz) => ({
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      difficultyLevel: quiz.difficultyLevel,
      totalParticipants: quiz.totalParticipants,
      questionsCount: quiz.questions?.length || 0,
    }))
  }

  @Get(':quizId')
  @ApiOperation({summary: 'Get quiz details by ID'})
  @ApiParam({name: 'quizId', description: 'Quiz ID'})
  @ApiResponse({status: HttpStatus.OK, description: 'Quiz details retrieved successfully'})
  @Response('quiz.get')
  async getQuizById(@Param('quizId') quizId: string): Promise<any> {
    const quiz = await this.quizService.findOne({_id: quizId})
    if (!quiz) {
      throw new Error('Quiz not found')
    }

    return {
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      difficultyLevel: quiz.difficultyLevel,
      totalParticipants: quiz.totalParticipants,
      status: quiz.status,
      startTime: quiz.startTime,
      endTime: quiz.endTime,
      questionsCount: quiz.questions?.length || 0,
    }
  }

  @Get(':quizId/leaderboard')
  @ApiOperation({summary: 'Get quiz leaderboard'})
  @ApiParam({name: 'quizId', description: 'Quiz ID'})
  @ApiQuery({name: 'limit', required: false, description: 'Number of top participants'})
  @ApiResponse({status: HttpStatus.OK, description: 'Leaderboard retrieved successfully'})
  @Response('quiz.leaderboard')
  async getLeaderboard(@Param('quizId') quizId: string, @Query('limit') limit?: number): Promise<any> {
    const leaderboard = await this.leaderboardService.findOne({quizId})
    if (!leaderboard) {
      return {
        quizId,
        rankings: [],
        lastUpdatedAt: null,
      }
    }

    const rankings = limit ? leaderboard.rankings.slice(0, limit) : leaderboard.rankings

    return {
      quizId,
      rankings: rankings.map((ranking) => ({
        rank: ranking.rank,
        userId: ranking.userId,
        username: ranking.username,
        avatar: ranking.avatar,
        totalScore: ranking.stats.totalScore,
        correctAnswers: ranking.stats.correctAnswers,
        totalQuestions: ranking.stats.totalQuestions,
        accuracyRate: ranking.performance.accuracyRate,
        averageTimePerQuestion: ranking.performance.averageTimePerQuestion,
        lastAttemptAt: ranking.lastAttemptAt,
      })),
      lastUpdatedAt: leaderboard.lastUpdatedAt,
    }
  }

  @Get(':quizId/sessions')
  @ApiOperation({summary: 'Get active sessions for a quiz'})
  @ApiParam({name: 'quizId', description: 'Quiz ID'})
  @ApiResponse({status: HttpStatus.OK, description: 'Active sessions retrieved successfully'})
  @Response('quiz.sessions')
  async getActiveSessions(@Param('quizId') quizId: string): Promise<any[]> {
    const allSessions = this.quizStateManager.getAllActiveSessions()
    const quizSessions = allSessions.filter((session) => session.quizId === quizId)

    return quizSessions.map((session) => ({
      sessionId: session.sessionId,
      quizId: session.quizId,
      status: session.status,
      participantCount: session.participants.size,
      currentQuestionIndex: session.currentQuestionIndex,
      createdAt: session.createdAt,
      participants: Array.from(session.participants.values()).map((p) => ({
        userId: p.userId,
        username: p.username,
        status: p.status,
        joinedAt: p.joinedAt,
      })),
    }))
  }

  @Post(':quizId/join')
  @ApiOperation({summary: 'Join a quiz (HTTP endpoint)'})
  @ApiParam({name: 'quizId', description: 'Quiz ID'})
  @ApiResponse({status: HttpStatus.CREATED, description: 'Successfully joined quiz'})
  @Response('quiz.joined')
  async joinQuiz(@Param('quizId') quizId: string, @Body() joinQuizDto: JoinQuizDto): Promise<any> {
    joinQuizDto.quizId = quizId

    const quiz = await this.quizService.findOne({_id: quizId})
    if (!quiz) {
      throw new Error('Quiz not found')
    }

    const now = new Date()
    if (now < quiz.startTime || now > quiz.endTime) {
      throw new Error('Quiz is not active')
    }

    return {
      message: 'Quiz join request received. Please connect via WebSocket to participate.',
      quizId,
      websocketEndpoint: '/quiz',
      requiredEvents: ['join_quiz', 'participant_ready', 'submit_answer'],
    }
  }

  @Get('user/:userId/sessions')
  @ApiOperation({summary: 'Get user quiz sessions'})
  @ApiParam({name: 'userId', description: 'User ID'})
  @ApiResponse({status: HttpStatus.OK, description: 'User sessions retrieved successfully'})
  @Response('quiz.userSessions')
  async getUserSessions(@Param('userId') userId: string): Promise<any[]> {
    const sessions = await this.quizSessionService.findAll(
      {userId},
      {
        order: {createdAt: ENUM_PAGINATION_ORDER_DIRECTION_TYPE.DESC},
      }
    )

    return sessions.map((session) => ({
      sessionId: session._id.toString(),
      quizId: session.quizId,
      status: session.status,
      startTime: session.startTime,
      endTime: session.endTime,
      currentScore: session.progress?.currentScore || 0,
      completedQuestions: session.progress?.completedQuestions || 0,
    }))
  }
}

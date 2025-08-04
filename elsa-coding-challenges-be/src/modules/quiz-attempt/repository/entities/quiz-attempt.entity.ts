import {DatabaseMongoObjectIdEntityAbstract} from '@infras/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract'
import {DatabaseEntity} from '@infras/database/decorators/database.decorator'
import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {
  IQuizAttemptPerformance,
  IQuizAttemptQuizInfo,
  IQuizAttemptRankings,
  IQuizAttemptUserInfo,
} from '../../interfaces/quiz-attempt.interface'

@DatabaseEntity()
export class QuizAttemptEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({required: true, index: true})
  quizId: string

  @Prop({required: true, index: true})
  userId: string

  @Prop({required: true})
  totalScore: number

  @Prop({required: true})
  correctAnswers: number

  @Prop({required: true})
  totalQuestions: number

  @Prop({required: true})
  totalTimeSpent: number

  @Prop({required: true})
  completedAt: Date

  @Prop({required: true})
  attemptNumber: number

  @Prop({type: Object, required: true})
  performance: IQuizAttemptPerformance

  @Prop({type: Object, required: true})
  userInfo: IQuizAttemptUserInfo

  @Prop({type: Object, required: true})
  quizInfo: IQuizAttemptQuizInfo

  @Prop({type: Object})
  rankings: IQuizAttemptRankings
}

export type QuizAttemptDoc = QuizAttemptEntity & Document
export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttemptEntity)

// Indexes for better query performance
QuizAttemptSchema.index({userId: 1, quizId: 1})
QuizAttemptSchema.index({userId: 1, completedAt: -1})
QuizAttemptSchema.index({quizId: 1, totalScore: -1})
QuizAttemptSchema.index({quizId: 1, totalTimeSpent: 1})

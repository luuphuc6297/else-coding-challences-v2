import {DatabaseMongoObjectIdEntityAbstract} from '@infras/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract'
import {DatabaseEntity} from '@infras/database/decorators/database.decorator'
import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

export enum QuizSessionStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

@DatabaseEntity()
export class QuizSessionEntity extends DatabaseMongoObjectIdEntityAbstract {

  @Prop({required: true})
  quizId: string

  @Prop({required: true})
  userId: string

  @Prop({
    type: String,
    enum: Object.values(QuizSessionStatus),
    default: QuizSessionStatus.WAITING,
  })
  status: QuizSessionStatus

  @Prop({required: true})
  startTime: Date

  @Prop({type: Date})
  endTime: Date

  @Prop({type: Object})
  settings: {
    timeLimit: number
    shuffleQuestions: boolean
    shuffleOptions: boolean
  }

  @Prop([
    {
      type: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      data: {
        type: Object,
      },
    },
  ])
  events: Array<{
    type: string
    timestamp: Date
    data: any
  }>

  @Prop({required: true, default: 0})
  currentQuestionIndex: number

  @Prop({type: Map})
  submittedAnswers: Map<
    string,
    {
      answer: string
      timeSpent: number
      points: number
      isCorrect: boolean
    }
  >

  @Prop({type: Object})
  progress: {
    completedQuestions: number
    currentScore: number
    remainingTime: number
  }

  @Prop({type: Object})
  results: {
    finalScore: number
    correctAnswers: number
    totalTimeSpent: number
    accuracy: number
  }
}

export type QuizSessionDoc = QuizSessionEntity & Document
export const QuizSessionSchema = SchemaFactory.createForClass(QuizSessionEntity)

// Indexes
QuizSessionSchema.index({quizId: 1, userId: 1})
QuizSessionSchema.index({status: 1})
QuizSessionSchema.index({startTime: 1})
QuizSessionSchema.index({endTime: 1})

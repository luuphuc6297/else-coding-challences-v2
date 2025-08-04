import {DatabaseMongoObjectIdEntityAbstract} from '@infras/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract'
import {DatabaseEntity} from '@infras/database/decorators/database.decorator'
import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {ENUM_QUESTION_DIFFICULTY} from '../../constants/question.enum.constant'
import {IQuestionMetadata, IQuestionStatistics} from '../../interfaces/question.interface'

@DatabaseEntity()
export class QuestionEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({required: true})
  content: string

  @Prop({type: [String], required: true})
  options: string[]

  @Prop({required: true})
  correctAnswer: string

  @Prop({required: true})
  points: number

  @Prop({default: 30})
  timeLimit: number

  @Prop()
  category?: string

  @Prop({required: true, enum: Object.values(ENUM_QUESTION_DIFFICULTY)})
  difficulty: ENUM_QUESTION_DIFFICULTY

  @Prop({type: Object})
  metadata?: IQuestionMetadata

  @Prop({type: Object, default: {timesUsed: 0, correctAnswerRate: 0, averageTimeSpent: 0}})
  statistics: IQuestionStatistics

  @Prop({type: [String], default: []})
  tags: string[]

  @Prop({default: true})
  isActive: boolean
}

export type QuestionDoc = QuestionEntity & Document
export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity)

// Indexes
QuestionSchema.index({difficulty: 1})
QuestionSchema.index({category: 1})
QuestionSchema.index({tags: 1})
QuestionSchema.index({points: 1})
QuestionSchema.index({'statistics.correctAnswerRate': -1})

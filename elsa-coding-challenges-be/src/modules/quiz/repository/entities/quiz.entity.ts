import {DatabaseMongoObjectIdEntityAbstract} from '@infras/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract'
import {DatabaseEntity} from '@infras/database/decorators/database.decorator'
import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {ENUM_QUIZ_DIFFICULTY, ENUM_QUIZ_STATUS} from '../../constants/quiz.enum.constant'

@DatabaseEntity()
export class QuizEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({required: true})
  title: string

  @Prop()
  description: string

  @Prop({required: true})
  questions: string[]

  @Prop({required: true})
  timeLimit: number

  @Prop({required: true})
  startTime: Date

  @Prop({required: true})
  endTime: Date

  @Prop({
    type: String,
    enum: Object.values(ENUM_QUIZ_STATUS),
    default: ENUM_QUIZ_STATUS.DRAFT,
  })
  status: ENUM_QUIZ_STATUS

  @Prop({
    type: String,
    enum: Object.values(ENUM_QUIZ_DIFFICULTY),
    required: true,
  })
  difficultyLevel: ENUM_QUIZ_DIFFICULTY

  @Prop({required: true})
  settingId: string

  @Prop({default: 0})
  totalParticipants: number

  @Prop()
  tags: string[]
}

export type QuizDoc = QuizEntity & Document
export const QuizSchema = SchemaFactory.createForClass(QuizEntity)

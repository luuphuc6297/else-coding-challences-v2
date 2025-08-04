import {ApiKeyEntity} from '@infras/api-key/repository/entities/api-key.entity'
import {DatabaseMongoObjectIdEntityAbstract} from '@infras/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract'
import {DatabaseEntity} from '@infras/database/decorators/database.decorator'
import {ENUM_LOGGER_ACTION, ENUM_LOGGER_LEVEL, ENUM_LOGGER_METHOD} from '@infras/logger/constants/logger.enum.constant'
import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

export const LoggerDatabaseName = 'loggers'

@DatabaseEntity({collection: LoggerDatabaseName})
export class LoggerEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    required: true,
    enum: ENUM_LOGGER_LEVEL,
    type: String,
  })
  level: string

  @Prop({
    required: true,
    enum: ENUM_LOGGER_ACTION,
    type: String,
  })
  action: string

  @Prop({
    required: true,
    enum: ENUM_LOGGER_METHOD,
    type: String,
  })
  method: string

  @Prop({
    required: false,
    type: String,
  })
  requestId?: string

  @Prop({
    required: false,
    type: String,
  })
  user?: string

  @Prop({
    required: false,
    type: String,
  })
  role?: string

  @Prop({
    required: false,
    ref: ApiKeyEntity.name,
    type: String,
  })
  apiKey?: string

  @Prop({
    required: true,
    default: true,
    type: Boolean,
  })
  anonymous: boolean

  @Prop({
    required: true,
    type: String,
  })
  description: string

  @Prop({
    required: false,
    type: Object,
  })
  params?: Record<string, any>

  @Prop({
    required: false,
    type: Object,
  })
  bodies?: Record<string, any>

  @Prop({
    required: false,
    type: Number,
  })
  statusCode?: number

  @Prop({
    required: false,
    type: String,
  })
  path?: string

  @Prop({
    required: false,
    default: [],
    type: Array<string>,
  })
  tags: string[]
}

export const LoggerSchema = SchemaFactory.createForClass(LoggerEntity)

export type LoggerDoc = LoggerEntity & Document

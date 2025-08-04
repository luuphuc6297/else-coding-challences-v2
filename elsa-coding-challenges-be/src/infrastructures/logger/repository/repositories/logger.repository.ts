import {ApiKeyEntity} from '@infras/api-key/repository/entities/api-key.entity'
import {DatabaseMongoObjectIdRepositoryAbstract} from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {LoggerDoc, LoggerEntity} from '@infras/logger/repository/entities/logger.entity'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'

@Injectable()
export class LoggerRepository extends DatabaseMongoObjectIdRepositoryAbstract<LoggerEntity, LoggerDoc> {
  constructor(
    @DatabaseModel(LoggerEntity.name)
    private readonly LoggerDoc: Model<LoggerEntity>
  ) {
    super(LoggerDoc, {
      path: 'apiKey',
      match: '_id',
      model: ApiKeyEntity.name,
    })
  }
}

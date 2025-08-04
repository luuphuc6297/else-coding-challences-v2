import {ApiKeyDoc, ApiKeyEntity} from '@infras/api-key/repository/entities/api-key.entity'
import {DatabaseMongoObjectIdRepositoryAbstract} from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'

@Injectable()
export class ApiKeyRepository extends DatabaseMongoObjectIdRepositoryAbstract<ApiKeyEntity, ApiKeyDoc> {
  constructor(
    @DatabaseModel(ApiKeyEntity.name)
    private readonly ApiKeyDoc: Model<ApiKeyEntity>
  ) {
    super(ApiKeyDoc)
  }
}

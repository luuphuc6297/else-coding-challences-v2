import {DatabaseMongoObjectIdRepositoryAbstract} from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'
import {UserDoc, UserEntity} from '../entities/user.entity'

@Injectable()
export class UserRepository extends DatabaseMongoObjectIdRepositoryAbstract<UserEntity, UserDoc> {
  constructor(
    @DatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>
  ) {
    super(userModel)
  }
}

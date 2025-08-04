import {DatabaseGenericServiceAbstract} from '@infras/database/abstracts/database.generic.service.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'
import {UserDoc, UserEntity} from '../repository/entities/user.entity'

@Injectable()
export class UserService extends DatabaseGenericServiceAbstract<UserEntity, UserDoc> {
  constructor(
    @DatabaseModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>
  ) {
    super(userModel)
  }
}

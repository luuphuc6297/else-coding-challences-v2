import {DatabaseMongoObjectIdEntityAbstract} from '@infras/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract'
import {DatabaseEntity} from '@infras/database/decorators/database.decorator'
import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'
import {IUserPermissions, IUserProfile, IUserStatistics} from '../../interfaces/user.interface'

@DatabaseEntity()
export class UserEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({required: true, unique: true})
  email: string

  @Prop({required: true})
  username: string

  @Prop()
  password: string

  @Prop({type: Object})
  profile: IUserProfile

  @Prop({type: Object})
  statistics: IUserStatistics

  @Prop({type: [String]})
  badges: string[]

  @Prop({type: Object})
  permissions: IUserPermissions

  @Prop({default: true})
  isActive: boolean

  @Prop()
  lastLoginAt: Date
}

export type UserDoc = UserEntity & Document
export const UserSchema = SchemaFactory.createForClass(UserEntity)

// Indexes
UserSchema.index({email: 1}, {unique: true})
UserSchema.index({username: 1})
UserSchema.index({'statistics.rank': 1})

import {DatabaseMongoObjectIdEntityAbstract} from '@infras/database/abstracts/mongo/entities/database.mongo.object-id.entity.abstract'
import {DatabaseEntity} from '@infras/database/decorators/database.decorator'
import {ENUM_POLICY_SUBJECT} from '@infras/policy/constants/policy.enum.constant'
import {IPolicyRule} from '@infras/policy/interfaces/policy.interface'
import {ENUM_ROLE_TYPE} from '@infras/role/constants/role.enum.constant'
import {Prop, SchemaFactory} from '@nestjs/mongoose'
import {CallbackWithoutResultAndOptionalError, Document} from 'mongoose'

export const RoleDatabaseName = 'roles'

@DatabaseEntity({collection: RoleDatabaseName})
export class RoleEntity extends DatabaseMongoObjectIdEntityAbstract {
  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 30,
    type: String,
  })
  name: string

  @Prop({
    required: false,
    trim: true,
    type: String,
  })
  description?: string

  @Prop({
    required: true,
    default: true,
    index: true,
    type: Boolean,
  })
  isActive: boolean

  @Prop({
    required: true,
    enum: ENUM_ROLE_TYPE,
    index: true,
    type: String,
  })
  type: ENUM_ROLE_TYPE

  @Prop({
    required: true,
    default: [],
    type: [
      {
        subject: {
          type: String,
          enum: ENUM_POLICY_SUBJECT,
          required: true,
        },
        action: {
          type: Array,
          required: true,
          default: [],
        },
      },
    ],
  })
  permissions: IPolicyRule[]
}

export const RoleSchema = SchemaFactory.createForClass(RoleEntity)

export type RoleDoc = RoleEntity & Document

RoleSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  this.name = this.name.toLowerCase()

  next()
})

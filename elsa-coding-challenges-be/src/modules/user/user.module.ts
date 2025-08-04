import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {DATABASE_CONNECTION_NAME} from '@infras/database/constants/database.constant'
import {UserEntity, UserSchema} from './repository/entities/user.entity'
import {UserService} from './services/user.service'

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserEntity.name,
          schema: UserSchema,
        },
      ],
      DATABASE_CONNECTION_NAME
    ),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

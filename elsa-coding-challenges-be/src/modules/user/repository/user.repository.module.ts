import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'
import {UserEntity, UserSchema} from './entities/user.entity'
import {UserRepository} from './repositories/user.repository'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: UserEntity.name,
          schema: UserSchema,
        },
      ],
      repositories: [UserRepository],
    }),
  ],
  exports: [UserRepository],
})
export class UserRepositoryModule {}

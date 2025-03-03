import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserEntity, UserSchema } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'

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
    exports: [UserRepository],
    providers: [UserRepository],
})
export class UserRepositoryModule {} 
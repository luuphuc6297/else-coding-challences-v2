import {
    ApiKeyEntity,
    ApiKeySchema,
} from '@infras/api-key/repository/entities/api-key.entity'
import { ApiKeyRepository } from '@infras/api-key/repository/repositories/api-key.repository'
import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    providers: [ApiKeyRepository],
    exports: [ApiKeyRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: ApiKeyEntity.name,
                    schema: ApiKeySchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class ApiKeyRepositoryModule {}

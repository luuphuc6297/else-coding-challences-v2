import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { LoggerEntity, LoggerSchema } from '@infras/logger/repository/entities/logger.entity'
import { LoggerRepository } from '@infras/logger/repository/repositories/logger.repository'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    providers: [LoggerRepository],
    exports: [LoggerRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: LoggerEntity.name,
                    schema: LoggerSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class LoggerRepositoryModule {}

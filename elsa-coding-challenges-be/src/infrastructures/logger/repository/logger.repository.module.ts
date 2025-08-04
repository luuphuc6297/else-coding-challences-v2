import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {LoggerEntity, LoggerSchema} from '@infras/logger/repository/entities/logger.entity'
import {LoggerRepository} from '@infras/logger/repository/repositories/logger.repository'
import {Module} from '@nestjs/common'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: LoggerEntity.name,
          schema: LoggerSchema,
        },
      ],
      repositories: [LoggerRepository],
    }),
  ],
  exports: [LoggerRepository],
})
export class LoggerRepositoryModule {}

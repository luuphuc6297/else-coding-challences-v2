import {ApiKeyEntity, ApiKeySchema} from '@infras/api-key/repository/entities/api-key.entity'
import {ApiKeyRepository} from '@infras/api-key/repository/repositories/api-key.repository'
import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: ApiKeyEntity.name,
          schema: ApiKeySchema,
        },
      ],
      repositories: [ApiKeyRepository],
    }),
  ],
  exports: [ApiKeyRepository],
})
export class ApiKeyRepositoryModule {}

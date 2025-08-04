import {ApiKeyXApiKeyStrategy} from '@infras/api-key/guards/x-api-key/api-key.x-api-key.strategy'
import {ApiKeyRepositoryModule} from '@infras/api-key/repository/api-key.repository.module'
import {ApiKeyService} from '@infras/api-key/services/api-key.service'
import {Module} from '@nestjs/common'

@Module({
  providers: [ApiKeyService, ApiKeyXApiKeyStrategy],
  exports: [ApiKeyService],
  controllers: [],
  imports: [ApiKeyRepositoryModule],
})
export class ApiKeyModule {}

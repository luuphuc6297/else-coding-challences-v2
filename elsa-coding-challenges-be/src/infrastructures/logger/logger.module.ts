import { LoggerRepositoryModule } from '@infras/logger/repository/logger.repository.module'
import { Global, Module } from '@nestjs/common'
import { LoggerService } from './services/logger.service'

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
    imports: [LoggerRepositoryModule],
})
export class LoggerModule {}

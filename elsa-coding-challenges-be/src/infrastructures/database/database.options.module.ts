import { DatabaseOptionsService } from '@infras/database/services/database.options.service'
import { Module } from '@nestjs/common'

@Module({
    providers: [DatabaseOptionsService],
    exports: [DatabaseOptionsService],
    imports: [],
    controllers: [],
})
export class DatabaseOptionsModule {}

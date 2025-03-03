import { ResponseMiddlewareModule } from '@infras/response/middleware/response.middleware.module'
import { Module } from '@nestjs/common'

@Module({
    controllers: [],
    providers: [],
    imports: [ResponseMiddlewareModule],
})
export class ResponseModule {}

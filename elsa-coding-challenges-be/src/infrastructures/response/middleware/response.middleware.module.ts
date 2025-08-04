import {ResponseTimeMiddleware} from '@infras/response/middleware/time/response.time.middleware'
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'

@Module({})
export class ResponseMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*')
  }
}

import {
  RequestJsonBodyParserMiddleware,
  RequestRawBodyParserMiddleware,
  RequestTextBodyParserMiddleware,
  RequestUrlencodedBodyParserMiddleware,
} from '@infras/request/middleware/body-parser/request.body-parser.middleware'
import {RequestCorsMiddleware} from '@infras/request/middleware/cors/request.cors.middleware'
import {RequestHelmetMiddleware} from '@infras/request/middleware/helmet/request.helmet.middleware'
import {RequestTimestampMiddleware} from '@infras/request/middleware/timestamp/request.timestamp.middleware'
import {RequestTimezoneMiddleware} from '@infras/request/middleware/timezone/request.timezone.middleware'
import {RequestUserAgentMiddleware} from '@infras/request/middleware/user-agent/request.user-agent.middleware'
import {RequestVersionMiddleware} from '@infras/request/middleware/version/request.version.middleware'
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        RequestHelmetMiddleware,
        RequestJsonBodyParserMiddleware,
        RequestTextBodyParserMiddleware,
        RequestRawBodyParserMiddleware,
        RequestUrlencodedBodyParserMiddleware,
        RequestCorsMiddleware,
        RequestVersionMiddleware,
        RequestUserAgentMiddleware,
        RequestTimestampMiddleware,
        RequestTimezoneMiddleware
      )
      .forRoutes('*')
  }
}

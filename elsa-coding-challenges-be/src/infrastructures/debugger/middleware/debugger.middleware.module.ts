import {
  DebuggerHttpMiddleware,
  DebuggerHttpResponseMiddleware,
  DebuggerHttpWriteIntoConsoleMiddleware,
} from '@infras/debugger/middleware/http/debugger.http.middleware'
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common'

@Module({})
export class DebuggerMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(DebuggerHttpResponseMiddleware, DebuggerHttpMiddleware, DebuggerHttpWriteIntoConsoleMiddleware)
      .forRoutes('*')
  }
}

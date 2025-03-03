import { MessageCustomLanguageMiddleware } from '@infras/message/middleware/custom-language/message.custom-language.middleware'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

@Module({})
export class MessageMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(MessageCustomLanguageMiddleware).forRoutes('*')
    }
}

import { MessageMiddlewareModule } from '@infras/message/middleware/message.middleware.module'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import { ENUM_MESSAGE_LANGUAGE } from './constants/message.enum.constant'
import { MessageService } from './services/message.service'

@Global()
@Module({
    providers: [MessageService],
    exports: [MessageService],
    imports: [
        I18nModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: (
                    configService.get<string[]>('message.availableLanguage') ?? ['en']
                ).join(','),
                fallbacks: Object.values(ENUM_MESSAGE_LANGUAGE).reduce(
                    (a, v) => ({ ...a, [`${v}-*`]: v }),
                    {}
                ),
                loaderOptions: {
                    path: path.join(__dirname, '../../languages'),
                    watch: true,
                },
            }),
            loader: I18nJsonLoader,
            inject: [ConfigService],
            resolvers: [new HeaderResolver(['x-custom-lang'])],
        }),
        MessageMiddlewareModule,
    ],
    controllers: [],
})
export class MessageModule {}

import { RequestTimeoutInterceptor } from '@infras/request/interceptors/request.timeout.interceptor'
import { RequestMiddlewareModule } from '@infras/request/middleware/request.middleware.module'
import {
    HttpStatus,
    Module,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler'
import { ENUM_REQUEST_STATUS_CODE_ERROR } from './constants/request.status-code.constant'
import { IsPasswordMediumConstraint } from './validations/request.is-password-medium.validation'
import { IsPasswordStrongConstraint } from './validations/request.is-password-strong.validation'
import { IsPasswordWeakConstraint } from './validations/request.is-password-weak.validation'

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestTimeoutInterceptor,
        },
        {
            provide: APP_PIPE,
            useFactory: () =>
                new ValidationPipe({
                    transform: true,
                    skipNullProperties: false,
                    skipUndefinedProperties: false,
                    skipMissingProperties: false,
                    forbidUnknownValues: false,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    exceptionFactory: async (errors: ValidationError[]) =>
                        new UnprocessableEntityException({
                            statusCode: ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                            message: 'request.validation',
                            errors,
                        }),
                }),
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        IsPasswordStrongConstraint,
        IsPasswordMediumConstraint,
        IsPasswordWeakConstraint,
    ],
    imports: [
        RequestMiddlewareModule,
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
                throttlers: [
                    {
                        ttl: config.get('request.throttle.ttl') ?? 1000,
                        limit: config.get('request.throttle.limit') ?? 10,
                    },
                ],
            }),
        }),
    ],
})
export class RequestModule {}

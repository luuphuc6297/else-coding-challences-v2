import { ENUM_ERROR_STATUS_CODE_ERROR } from '@infras/error/constants/error.status-code.constant'
import {
    REQUEST_CUSTOM_TIMEOUT_META_KEY,
    REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
} from '@infras/request/constants/request.constant'
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    RequestTimeoutException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import ms from 'ms'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

type StringValue = `${number}ms` | `${number}s` | `${number}m` | `${number}h` | `${number}d` | `${number}y`

@Injectable()
export class RequestTimeoutInterceptor implements NestInterceptor<Promise<any>> {
    private readonly maxTimeoutInSecond: number

    constructor(
        private readonly configService: ConfigService,
        private readonly reflector: Reflector
    ) {
        this.maxTimeoutInSecond = this.configService.get<number>('request.timeout') ?? 5000 // 5s default
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        if (context.getType() === 'http') {
            const customTimeout = this.reflector.get<boolean>(
                REQUEST_CUSTOM_TIMEOUT_META_KEY,
                context.getHandler()
            )

            if (customTimeout) {
                const seconds = this.reflector.get<StringValue>(
                    REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
                    context.getHandler()
                )

                return next.handle().pipe(
                    timeout(ms(seconds)),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException({
                                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT,
                                message: 'http.clientError.requestTimeOut',
                            })
                        }
                        return throwError(() => err)
                    })
                )
            } else {
                return next.handle().pipe(
                    timeout(this.maxTimeoutInSecond),
                    catchError((err) => {
                        if (err instanceof TimeoutError) {
                            throw new RequestTimeoutException({
                                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_REQUEST_TIMEOUT,
                                message: 'http.clientError.requestTimeOut',
                            })
                        }
                        return throwError(() => err)
                    })
                )
            }
        }

        return next.handle()
    }
}

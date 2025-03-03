import {
    LOGGER_ACTION_META_KEY,
    LOGGER_OPTIONS_META_KEY,
} from '@infras/logger/constants/logger.constant'
import { ENUM_LOGGER_ACTION } from '@infras/logger/constants/logger.enum.constant'
import { LoggerInterceptor } from '@infras/logger/interceptors/logger.interceptor'
import { ILoggerOptions } from '@infras/logger/interfaces/logger.interface'
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common'

export function Logger(action: ENUM_LOGGER_ACTION, options?: ILoggerOptions): MethodDecorator {
    return applyDecorators(
        UseInterceptors(LoggerInterceptor),
        SetMetadata(LOGGER_ACTION_META_KEY, action),
        SetMetadata(LOGGER_OPTIONS_META_KEY, options ?? {})
    )
}

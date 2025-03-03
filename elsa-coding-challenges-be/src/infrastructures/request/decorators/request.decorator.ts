import {
    REQUEST_CUSTOM_TIMEOUT_META_KEY,
    REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY,
    REQUEST_PARAM_CLASS_DTOS_META_KEY,
} from '@infras/request/constants/request.constant'
import { RequestParamRawGuard } from '@infras/request/guards/request.param.guard'
import { RequestTimestampInterceptor } from '@infras/request/interceptors/request.timestamp.interceptor'
import { RequestUserAgentInterceptor } from '@infras/request/interceptors/request.user-agent.interceptor'
import { IRequestApp } from '@infras/request/interfaces/request.interface'
import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ClassConstructor } from 'class-transformer'
import { IResult } from 'ua-parser-js'

export const RequestUserAgent: () => ParameterDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext): IResult => {
        const { __userAgent } = ctx.switchToHttp().getRequest<IRequestApp>()
        return __userAgent
    }
)

export const RequestId: () => ParameterDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext): string => {
        const { __id } = ctx.switchToHttp().getRequest<IRequestApp>()
        return __id
    }
)

export const RequestXTimestamp: () => ParameterDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext): number => {
        const { __xTimestamp } = ctx.switchToHttp().getRequest<IRequestApp>()
        return __xTimestamp ?? Date.now()
    }
)

export const RequestTimestamp: () => ParameterDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext): number => {
        const { __timestamp } = ctx.switchToHttp().getRequest<IRequestApp>()
        return __timestamp
    }
)

export const RequestCustomLang: () => ParameterDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext): string[] => {
        const { __customLang } = ctx.switchToHttp().getRequest<IRequestApp>()
        return __customLang
    }
)

export function RequestParamGuard(...classValidation: ClassConstructor<any>[]): MethodDecorator {
    return applyDecorators(
        UseGuards(RequestParamRawGuard),
        SetMetadata(REQUEST_PARAM_CLASS_DTOS_META_KEY, classValidation)
    )
}

export function RequestValidateUserAgent(): MethodDecorator {
    return applyDecorators(UseInterceptors(RequestUserAgentInterceptor))
}

export function RequestValidateTimestamp(): MethodDecorator {
    return applyDecorators(UseInterceptors(RequestTimestampInterceptor))
}

export function RequestTimeout(seconds: string): MethodDecorator {
    return applyDecorators(
        SetMetadata(REQUEST_CUSTOM_TIMEOUT_META_KEY, true),
        SetMetadata(REQUEST_CUSTOM_TIMEOUT_VALUE_META_KEY, seconds)
    )
}

import {LOGGER_ACTION_META_KEY, LOGGER_OPTIONS_META_KEY} from '@infras/logger/constants/logger.constant'
import {ENUM_LOGGER_ACTION, ENUM_LOGGER_LEVEL} from '@infras/logger/constants/logger.enum.constant'
import {ILoggerOptions} from '@infras/logger/interfaces/logger.interface'
import {LoggerService} from '@infras/logger/services/logger.service'
import {ENUM_REQUEST_METHOD} from '@infras/request/constants/request.enum.constant'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common'
import {HttpArgumentsHost, RpcArgumentsHost} from '@nestjs/common/interfaces'
import {Reflector} from '@nestjs/core'
import {Response} from 'express'
import {Observable, tap} from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor<any> {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LoggerService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Promise<any> | string>> {
    if (context.getType() === 'http') {
      const ctx: HttpArgumentsHost = context.switchToHttp()
      const {apiKey, method, originalUrl, user, __id, body, params, path} = ctx.getRequest<IRequestApp>()
      const responseExpress = ctx.getResponse<Response>()

      return next.handle().pipe(
        tap(async (response: Promise<Record<string, any>>) => {
          const responseData: Record<string, any> = await response
          const responseStatus: number = responseExpress.statusCode
          const statusCode = responseData?.statusCode ?? responseStatus

          const loggerAction: ENUM_LOGGER_ACTION = this.reflector.get<ENUM_LOGGER_ACTION>(
            LOGGER_ACTION_META_KEY,
            context.getHandler()
          )
          const loggerOptions: ILoggerOptions = this.reflector.get<ILoggerOptions>(
            LOGGER_OPTIONS_META_KEY,
            context.getHandler()
          )

          await this.loggerService.raw({
            level: loggerOptions?.level ?? ENUM_LOGGER_LEVEL.INFO,
            action: loggerAction,
            description:
              loggerOptions?.description ?? `Request ${method} called, url ${originalUrl}, and action ${loggerAction}`,
            apiKey: apiKey?._id,
            user: user?._id,
            requestId: __id,
            method: method as ENUM_REQUEST_METHOD,
            role: user?.role,
            params,
            bodies: body,
            path,
            statusCode,
            tags: loggerOptions?.tags ?? [],
          })
        })
      )
    } else if (context.getType() === 'rpc') {
      const ctx: RpcArgumentsHost = context.switchToRpc()
      const {value, key, topic} = ctx.getData()

      return next.handle().pipe(
        tap(async () => {
          const loggerAction: ENUM_LOGGER_ACTION = this.reflector.get<ENUM_LOGGER_ACTION>(
            LOGGER_ACTION_META_KEY,
            context.getHandler()
          )
          const loggerOptions: ILoggerOptions = this.reflector.get<ILoggerOptions>(
            LOGGER_OPTIONS_META_KEY,
            context.getHandler()
          )

          await this.loggerService.raw({
            level: loggerOptions.level || ENUM_LOGGER_LEVEL.INFO,
            action: loggerAction,
            description: loggerOptions.description
              ? loggerOptions.description
              : `Request ${topic} called, url ${topic}, and action ${loggerAction}`,
            requestId: key,
            method: ENUM_REQUEST_METHOD.POST,
            bodies: value,
            statusCode: 200,
            path: topic,
            tags: loggerOptions && loggerOptions.tags ? loggerOptions.tags : [],
          })
        })
      )
    }

    return next.handle()
  }
}

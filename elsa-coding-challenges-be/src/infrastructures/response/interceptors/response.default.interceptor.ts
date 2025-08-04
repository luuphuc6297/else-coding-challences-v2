import {IMessage, IMessageOptionsProperties} from '@infras/message/interfaces/message.interface'
import {MessageService} from '@infras/message/services/message.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
  RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
} from '@infras/response/constants/response.constant'
import {IResponse} from '@infras/response/interfaces/response.interface'
import {
  ResponseDefaultSerialization,
  ResponseMetadataSerialization,
} from '@infras/response/serializations/response.default.serialization'
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common'
import {HttpArgumentsHost} from '@nestjs/common/interfaces'
import {Reflector} from '@nestjs/core'
import {ClassConstructor, ClassTransformOptions, plainToInstance} from 'class-transformer'
import {Response} from 'express'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'

@Injectable()
export class ResponseDefaultInterceptor<T> implements NestInterceptor<Promise<T>> {
  constructor(
    private readonly reflector: Reflector,
    private readonly messageService: MessageService
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<Promise<ResponseDefaultSerialization>>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<Record<string, any>>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp()
          const response: Response = ctx.getResponse()
          const request: IRequestApp = ctx.getRequest<IRequestApp>()

          let messagePath: string = this.reflector.get<string>(RESPONSE_MESSAGE_PATH_META_KEY, context.getHandler())
          const classSerialization: ClassConstructor<any> = this.reflector.get<ClassConstructor<any>>(
            RESPONSE_SERIALIZATION_META_KEY,
            context.getHandler()
          )
          const classSerializationOptions: ClassTransformOptions = this.reflector.get<ClassTransformOptions>(
            RESPONSE_SERIALIZATION_OPTIONS_META_KEY,
            context.getHandler()
          )
          let messageProperties: IMessageOptionsProperties = this.reflector.get<IMessageOptionsProperties>(
            RESPONSE_MESSAGE_PROPERTIES_META_KEY,
            context.getHandler()
          )

          // metadata
          const __customLang = request.__customLang
          const __requestId = request.__id
          const __path = request.path
          const __timestamp = request.__xTimestamp ?? request.__timestamp
          const __timezone = request.__timezone
          const __version = request.__version
          const __repoVersion = request.__repoVersion

          // set default response
          let statusCode: number = response.statusCode
          let data: Record<string, any> = {}
          let metadata: ResponseMetadataSerialization = {
            languages: __customLang,
            timestamp: __timestamp,
            timezone: __timezone,
            requestId: __requestId,
            path: __path,
            version: __version,
            repoVersion: __repoVersion,
          }

          // response
          const responseData = (await res) as IResponse

          if (responseData) {
            const {_metadata} = responseData
            data = responseData.data

            if (classSerialization) {
              data = plainToInstance(classSerialization, data, classSerializationOptions)
            }

            statusCode = _metadata?.customProperty?.statusCode ?? statusCode
            messagePath = _metadata?.customProperty?.message ?? messagePath
            messageProperties = _metadata?.customProperty?.messageProperties ?? messageProperties

            delete _metadata?.customProperty

            metadata = {
              ...metadata,
              ..._metadata,
            }
          }

          const message: string | IMessage = await this.messageService.get(messagePath, {
            customLanguages: __customLang,
            properties: messageProperties,
          })

          return {
            statusCode,
            message,
            _metadata: metadata,
            data,
          }
        })
      )
    }

    return next.handle()
  }
}

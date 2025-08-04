import {ApiKeyProtected} from '@infras/api-key/decorators/api-key.decorator'
import {HelperDateService} from '@infras/helper/services/helper.date.service'
import {ENUM_LOGGER_ACTION} from '@infras/logger/constants/logger.enum.constant'
import {Logger} from '@infras/logger/decorators/logger.decorator'
import {RequestUserAgent} from '@infras/request/decorators/request.decorator'
import {Response} from '@infras/response/decorators/response.decorator'
import {IResponse} from '@infras/response/interfaces/response.interface'
import {Controller, Get, VERSION_NEUTRAL} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {ApiTags} from '@nestjs/swagger'
import {AppHelloApiKeyDoc, AppHelloDoc} from 'src/app/docs/app.doc'
import {AppHelloSerialization} from 'src/app/serializations/app.hello.serialization'
import {IResult} from 'ua-parser-js'

@ApiTags('hello')
@Controller({
  version: VERSION_NEUTRAL,
  path: '/',
})
export class AppController {
  private readonly serviceName: string

  constructor(
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService
  ) {
    this.serviceName = this.configService.get<string>('app.name') ?? 'app'
  }

  @AppHelloDoc()
  @Response('app.hello', {serialization: AppHelloSerialization})
  @Logger(ENUM_LOGGER_ACTION.TEST, {tags: ['test']})
  @Get('/hello')
  async hello(@RequestUserAgent() userAgent: IResult): Promise<IResponse> {
    const newDate = this.helperDateService.create()

    return {
      _metadata: {
        customProperty: {
          messageProperties: {
            serviceName: this.serviceName,
          },
        },
      },
      data: {
        userAgent,
        date: newDate,
        format: this.helperDateService.format(newDate),
        timestamp: this.helperDateService.timestamp(newDate),
      },
    }
  }

  @AppHelloApiKeyDoc()
  @Response('app.hello', {serialization: AppHelloSerialization})
  @Logger(ENUM_LOGGER_ACTION.TEST, {tags: ['test']})
  @ApiKeyProtected()
  @Get('/hello/api-key')
  async helloApiKey(@RequestUserAgent() userAgent: IResult): Promise<IResponse> {
    const newDate = this.helperDateService.create()

    return {
      _metadata: {
        customProperty: {
          messageProperties: {
            serviceName: this.serviceName,
          },
        },
      },
      data: {
        userAgent,
        date: newDate,
        format: this.helperDateService.format(newDate),
        timestamp: this.helperDateService.timestamp(newDate),
      },
    }
  }
}

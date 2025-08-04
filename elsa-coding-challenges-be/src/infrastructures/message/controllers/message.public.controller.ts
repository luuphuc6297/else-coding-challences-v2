import {MessageEnumLanguageDoc} from '@infras/message/docs/message.enum.doc'
import {MessageLanguageSerialization} from '@infras/message/serializations/message.language.serialization'
import {MessageService} from '@infras/message/services/message.service'
import {Response} from '@infras/response/decorators/response.decorator'
import {IResponse} from '@infras/response/interfaces/response.interface'
import {Controller, Get, VERSION_NEUTRAL} from '@nestjs/common'
import {ApiTags} from '@nestjs/swagger'

@ApiTags('common.message.public')
@Controller({
  version: VERSION_NEUTRAL,
  path: '/message',
})
export class MessagePublicController {
  constructor(private readonly messageService: MessageService) {}

  @MessageEnumLanguageDoc()
  @Response('message.languages', {
    serialization: MessageLanguageSerialization,
  })
  @Get('/languages')
  async languages(): Promise<IResponse> {
    const languages: string[] = await this.messageService.getAvailableLanguages()

    return {
      data: {languages},
    }
  }
}

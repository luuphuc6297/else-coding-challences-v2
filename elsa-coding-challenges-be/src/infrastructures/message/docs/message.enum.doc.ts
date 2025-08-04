import {Doc} from '@infras/doc/decorators/doc.decorator'
import {MessageLanguageSerialization} from '@infras/message/serializations/message.language.serialization'
import {applyDecorators} from '@nestjs/common'

export function MessageEnumLanguageDoc(): MethodDecorator {
  return applyDecorators(
    Doc<MessageLanguageSerialization>('message.languages', {
      response: {serialization: MessageLanguageSerialization},
    })
  )
}

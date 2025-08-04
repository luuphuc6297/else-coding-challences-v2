import {ENUM_MESSAGE_LANGUAGE} from '@infras/message/constants/message.enum.constant'
import {ApiProperty} from '@nestjs/swagger'

export class MessageLanguageSerialization {
  @ApiProperty({
    enum: ENUM_MESSAGE_LANGUAGE,
    type: 'array',
    isArray: true,
  })
  language: ENUM_MESSAGE_LANGUAGE[]
}

import {ApiKeyGetSerialization} from '@infras/api-key/serializations/api-key.get.serialization'
import {ApiProperty} from '@nestjs/swagger'

export class ApiKeyListSerialization extends ApiKeyGetSerialization {
  @ApiProperty({required: false})
  override description?: never
}

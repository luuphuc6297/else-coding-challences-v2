import { ResponseIdSerialization } from '@infras/response/serializations/response.id.serialization'
import { ApiProperty } from '@nestjs/swagger'

export class ApiKeyCreateSerialization extends ResponseIdSerialization {
    @ApiProperty({
        description: 'Unique key of api key',
        example: 'api-key-123',
        required: true,
    })
    key: string

    @ApiProperty({
        description: 'Secret key of ApiKey, only show at once',
        example: 'secretKey123',
        required: true,
    })
    secret: string
}

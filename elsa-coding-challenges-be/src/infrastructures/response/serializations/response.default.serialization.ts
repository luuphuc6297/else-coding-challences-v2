import { ApiProperty } from '@nestjs/swagger'

export class ResponseMetadataSerialization {
    languages: string[]
    timestamp: number
    timezone: string
    requestId: string
    path: string
    version: string
    repoVersion: string;
    [key: string]: any
}

export class ResponseDefaultSerialization<T = Record<string, any>> {
    @ApiProperty({
        name: 'statusCode',
        type: Number,
        nullable: false,
        description: 'return specific status code for every endpoints',
        example: 200,
    })
    statusCode: number

    @ApiProperty({
        name: 'message',
        nullable: false,
        description: 'Message base on language',
        oneOf: [
            {
                type: 'string',
                example: 'message endpoint',
            },
            {
                type: 'object',
                example: {
                    en: 'This is test endpoint.',
                    id: 'Ini adalah endpoint test',
                },
            },
        ],
    })
    message: string | any

    data?: T
}

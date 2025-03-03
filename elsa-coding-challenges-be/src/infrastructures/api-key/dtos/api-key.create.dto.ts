import { faker } from '@faker-js/faker'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class ApiKeyCreateDto {
    @ApiProperty({
        description: 'Api Key name',
        example: `testapiname`,
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string

    @ApiProperty({
        description: 'Description of api key',
        example: 'blabla description',
        required: false,
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    description?: string

    @ApiProperty({
        description: 'User ID',
        example: faker.string.uuid(),
        required: true,
    })
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    user: string

    @ApiProperty({
        description: 'Api Key start date',
        example: faker.date.recent(),
        required: false,
        nullable: true,
    })
    @IsOptional()
    @Type(() => Date)
    startDate?: Date

    @ApiProperty({
        description: 'Api Key end date',
        example: faker.date.recent(),
        required: false,
        nullable: true,
    })
    @IsOptional()
    @Type(() => Date)
    endDate?: Date
}

export class ApiKeyCreateRawDto extends ApiKeyCreateDto {
    @ApiProperty({
        name: 'key',
        example: faker.string.alphanumeric(10),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    key: string

    @ApiProperty({
        name: 'secret',
        example: faker.string.alphanumeric(20),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    secret: string
}

export class ApiKeyCreateByUserDto extends OmitType(ApiKeyCreateDto, ['user'] as const) {}

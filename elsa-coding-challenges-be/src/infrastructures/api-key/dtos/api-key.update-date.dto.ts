import {faker} from '@faker-js/faker'
import {MinDateToday} from '@infras/request/validations/request.min-date-today.validation'
import {MinGreaterThanEqual} from '@infras/request/validations/request.min-greater-than-equal.validation'
import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {IsDate, IsNotEmpty} from 'class-validator'

export class ApiKeyUpdateDateDto {
  @ApiProperty({
    description: 'Api Key start date',
    example: faker.date.recent(),
    required: false,
    nullable: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDateToday()
  startDate: Date

  @ApiProperty({
    description: 'Api Key end date',
    example: faker.date.recent(),
    required: false,
    nullable: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinGreaterThanEqual('startDate')
  endDate: Date
}

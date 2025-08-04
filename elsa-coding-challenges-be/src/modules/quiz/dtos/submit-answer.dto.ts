import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {IsDate, IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min} from 'class-validator'

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'Quiz session ID',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string

  @ApiProperty({
    description: 'Question ID',
    example: '507f1f77bcf86cd799439013',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  questionId: string

  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439012',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID('4')
  userId: string

  @ApiProperty({
    description: 'Selected answer',
    example: 'option_a',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  answer: string

  @ApiProperty({
    description: 'Time spent on question in milliseconds',
    example: 15000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(300000)
  timeSpent: number

  @ApiProperty({
    description: 'Timestamp when answer was submitted',
    example: new Date(),
    required: true,
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  submittedAt: Date
}

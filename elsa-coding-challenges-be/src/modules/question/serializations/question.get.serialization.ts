import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'

export class QuestionMetadataSerialization {
  @ApiProperty({required: false})
  imageUrl?: string

  @ApiProperty({required: false})
  audioUrl?: string

  @ApiProperty({required: false})
  videoUrl?: string

  @ApiProperty({required: false})
  explanation?: string
}

export class QuestionStatisticsSerialization {
  @ApiProperty()
  timesUsed: number

  @ApiProperty()
  correctAnswerRate: number

  @ApiProperty()
  averageTimeSpent: number
}

export class QuestionGetSerialization {
  @ApiProperty()
  @Type(() => String)
  _id: string

  @ApiProperty()
  content: string

  @ApiProperty({type: [String]})
  options: string[]

  @ApiProperty()
  correctAnswer: string

  @ApiProperty()
  points: number

  @ApiProperty()
  timeLimit: number

  @ApiProperty({required: false})
  category?: string

  @ApiProperty({enum: ['EASY', 'MEDIUM', 'HARD']})
  difficulty: string

  @ApiProperty({type: () => QuestionMetadataSerialization, required: false})
  metadata?: QuestionMetadataSerialization

  @ApiProperty({type: () => QuestionStatisticsSerialization})
  statistics: QuestionStatisticsSerialization

  @ApiProperty({type: [String]})
  tags: string[]

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

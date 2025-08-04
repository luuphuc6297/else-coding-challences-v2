import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'
import {IsNotEmpty, IsString, IsArray, IsNumber, IsEnum, IsOptional, ValidateNested} from 'class-validator'

export class QuestionMetadataDto {
  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  imageUrl?: string

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  audioUrl?: string

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  videoUrl?: string

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  explanation?: string
}

export class QuestionCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string

  @ApiProperty({type: [String]})
  @IsArray()
  @IsString({each: true})
  options: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  correctAnswer: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  points: number

  @ApiProperty({required: false, default: 30})
  @IsOptional()
  @IsNumber()
  timeLimit?: number

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  category?: string

  @ApiProperty({enum: ['EASY', 'MEDIUM', 'HARD']})
  @IsNotEmpty()
  @IsEnum(['EASY', 'MEDIUM', 'HARD'])
  difficulty: string

  @ApiProperty({type: QuestionMetadataDto, required: false})
  @IsOptional()
  @ValidateNested()
  @Type(() => QuestionMetadataDto)
  metadata?: QuestionMetadataDto

  @ApiProperty({type: [String], required: false})
  @IsOptional()
  @IsArray()
  @IsString({each: true})
  tags?: string[]
}

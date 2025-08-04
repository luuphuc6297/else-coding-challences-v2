import {ApiProperty} from '@nestjs/swagger'
import {IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength} from 'class-validator'

export class ParticipantReadyDto {
  @ApiProperty({
    description: 'Quiz session ID',
    example: '507f1f77bcf86cd799439011',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  sessionId: string

  @ApiProperty({
    description: 'User ID',
    example: '507f1f77bcf86cd799439012',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID('4')
  userId: string

  @ApiProperty({
    description: 'Username for display',
    example: 'john_doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string
}

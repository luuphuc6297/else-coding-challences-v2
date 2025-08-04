import {ApiProperty} from '@nestjs/swagger'
import {Type} from 'class-transformer'

export class UserProfileSerialization {
  @ApiProperty()
  avatar?: string

  @ApiProperty()
  timezone?: string

  @ApiProperty()
  language?: string

  @ApiProperty()
  preferences?: {
    notifications: boolean
    soundEnabled: boolean
    darkMode: boolean
  }
}

export class UserStatisticsSerialization {
  @ApiProperty()
  totalQuizzesTaken: number

  @ApiProperty()
  averageScore: number

  @ApiProperty()
  totalPoints: number

  @ApiProperty()
  rank: number

  @ApiProperty()
  streakDays: number

  @ApiProperty()
  bestCategories: string[]
}

export class UserPermissionsSerialization {
  @ApiProperty()
  roles: string[]

  @ApiProperty()
  canCreateQuiz: boolean

  @ApiProperty()
  isAdmin: boolean
}

export class UserPayloadSerialization {
  @ApiProperty()
  @Type(() => String)
  _id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  username: string

  @ApiProperty({type: () => UserProfileSerialization})
  profile: UserProfileSerialization

  @ApiProperty({type: () => UserStatisticsSerialization})
  statistics: UserStatisticsSerialization

  @ApiProperty()
  badges: string[]

  @ApiProperty({type: () => UserPermissionsSerialization})
  permissions: UserPermissionsSerialization

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  lastLoginAt: Date
}

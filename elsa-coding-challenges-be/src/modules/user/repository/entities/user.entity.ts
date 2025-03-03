import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class UserEntity extends Document {
    @Prop({ required: true })
    _id: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    username: string

    @Prop()
    password: string

    @Prop({ type: Object })
    profile: {
        avatar?: string
        timezone?: string
        language?: string
        preferences?: {
            notifications: boolean
            soundEnabled: boolean
            darkMode: boolean
        }
    }

    @Prop({ type: Object })
    statistics: {
        totalQuizzesTaken: number
        averageScore: number
        totalPoints: number
        rank: number
        streakDays: number
        bestCategories: string[]
    }

    @Prop({ type: [String] })
    badges: string[]

    @Prop({ type: Object })
    permissions: {
        roles: string[]
        canCreateQuiz: boolean
        isAdmin: boolean
    }

    @Prop({ default: true })
    isActive: boolean

    @Prop()
    lastLoginAt: Date
}

export type UserDoc = UserEntity & Document
export const UserSchema = SchemaFactory.createForClass(UserEntity)

// Indexes
UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ username: 1 })
UserSchema.index({ 'statistics.rank': 1 })

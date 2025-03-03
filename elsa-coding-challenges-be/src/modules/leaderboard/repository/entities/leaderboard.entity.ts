import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class LeaderboardEntity extends Document {
    @Prop({ required: true })
    _id: string

    @Prop({ required: true, index: true })
    quizId: string

    @Prop({
        type: [
            {
                userId: { type: String, required: true },
                username: { type: String, required: true },
                avatar: String,
                rank: { type: Number, required: true },
                stats: {
                    totalScore: { type: Number, required: true, default: 0 },
                    correctAnswers: { type: Number, required: true, default: 0 },
                    totalQuestions: { type: Number, required: true, default: 0 },
                    totalTimeSpent: { type: Number, required: true, default: 0 }, // milliseconds
                },
                performance: {
                    accuracyRate: { type: Number, required: true, default: 0 },
                    averageTimePerQuestion: { type: Number, required: true, default: 0 },
                    scorePerMinute: { type: Number, required: true, default: 0 },
                },
                lastAttemptAt: { type: Date, required: true },
            },
        ],
        default: [],
    })
    rankings: Array<{
        userId: string
        username: string
        avatar?: string
        rank: number
        stats: {
            totalScore: number
            correctAnswers: number
            totalQuestions: number
            totalTimeSpent: number
        }
        performance: {
            accuracyRate: number
            averageTimePerQuestion: number
            scorePerMinute: number
        }
        lastAttemptAt: Date
    }>

    @Prop({ required: true, default: Date.now })
    lastUpdatedAt: Date

    @Prop({ required: true, default: 100 })
    maxRankings: number

    @Prop({ type: Object, required: true })
    quizInfo: {
        title: string
        totalQuestions: number
        difficulty: string
        duration: number // milliseconds
    }

    @Prop({ default: false })
    isActive: boolean
}

export type LeaderboardDoc = LeaderboardEntity & Document
export const LeaderboardSchema = SchemaFactory.createForClass(LeaderboardEntity)

// Indexes for better query performance
LeaderboardSchema.index({ quizId: 1, isActive: 1 })
LeaderboardSchema.index({ 'rankings.userId': 1, quizId: 1 })

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class QuizAttemptEntity extends Document {
    @Prop({ required: true })
    _id: string

    @Prop({ required: true, index: true })
    quizId: string

    @Prop({ required: true, index: true })
    userId: string

    @Prop({ required: true })
    totalScore: number

    @Prop({ required: true })
    correctAnswers: number

    @Prop({ required: true })
    totalQuestions: number

    @Prop({ required: true })
    totalTimeSpent: number // milliseconds

    @Prop({ required: true })
    completedAt: Date

    @Prop({ required: true })
    attemptNumber: number

    @Prop({ type: Object, required: true })
    performance: {
        accuracyRate: number
        averageTimePerQuestion: number
        scorePerMinute: number
    }

    @Prop({ type: Object, required: true })
    userInfo: {
        username: string
        avatar?: string
    }

    @Prop({ type: Object, required: true })
    quizInfo: {
        title: string
        difficulty: string
        duration: number // milliseconds
    }

    @Prop({ type: Object })
    rankings: {
        scoreRank?: number
        timeRank?: number
        accuracyRank?: number
    }
}

export type QuizAttemptDoc = QuizAttemptEntity & Document
export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttemptEntity)

// Indexes for better query performance
QuizAttemptSchema.index({ userId: 1, quizId: 1 })
QuizAttemptSchema.index({ userId: 1, completedAt: -1 })
QuizAttemptSchema.index({ quizId: 1, totalScore: -1 })
QuizAttemptSchema.index({ quizId: 1, totalTimeSpent: 1 }) 
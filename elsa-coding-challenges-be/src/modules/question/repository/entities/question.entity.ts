import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class QuestionEntity extends Document {
    @Prop({ required: true })
    _id: string

    @Prop({ required: true })
    content: string

    @Prop({ type: [String], required: true })
    options: string[]

    @Prop({ required: true })
    correctAnswer: string

    @Prop({ required: true })
    points: number

    @Prop({ default: 30 })
    timeLimit: number

    @Prop()
    category?: string

    @Prop({ required: true, enum: ['EASY', 'MEDIUM', 'HARD'] })
    difficulty: string

    @Prop({ type: Object })
    metadata?: {
        imageUrl?: string
        audioUrl?: string
        videoUrl?: string
        explanation?: string
    }

    @Prop({ type: Object, default: { timesUsed: 0, correctAnswerRate: 0, averageTimeSpent: 0 } })
    statistics: {
        timesUsed: number
        correctAnswerRate: number
        averageTimeSpent: number
    }

    @Prop({ type: [String], default: [] })
    tags: string[]

    @Prop({ default: true })
    isActive: boolean
}

export type QuestionDoc = QuestionEntity & Document
export const QuestionSchema = SchemaFactory.createForClass(QuestionEntity)

// Indexes
QuestionSchema.index({ difficulty: 1 })
QuestionSchema.index({ category: 1 })
QuestionSchema.index({ tags: 1 })
QuestionSchema.index({ points: 1 })
QuestionSchema.index({ 'statistics.correctAnswerRate': -1 }) 
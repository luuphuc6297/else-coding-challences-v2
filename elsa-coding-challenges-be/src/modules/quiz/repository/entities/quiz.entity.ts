import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class QuizEntity extends Document {
    @Prop({ required: true })
    title: string

    @Prop()
    description: string

    @Prop({ required: true })
    questions: string[]

    @Prop({ required: true })
    timeLimit: number

    @Prop({ required: true })
    startTime: Date

    @Prop({ required: true })
    endTime: Date

    @Prop({
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        default: 'DRAFT',
    })
    status: string

    @Prop({
        type: String,
        enum: ['EASY', 'MEDIUM', 'HARD'],
        required: true,
    })
    difficultyLevel: string

    @Prop({ required: true })
    settingId: string

    @Prop({ default: 0 })
    totalParticipants: number

    @Prop()
    tags: string[]
}

export type QuizDoc = QuizEntity & Document
export const QuizSchema = SchemaFactory.createForClass(QuizEntity)

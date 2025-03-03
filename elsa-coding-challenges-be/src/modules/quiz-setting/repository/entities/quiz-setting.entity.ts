import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class QuizSettingEntity extends Document {
    @Prop({ required: true })
    quizId: string

    @Prop({ default: false })
    shuffleQuestions: boolean

    @Prop({ default: false })
    shuffleOptions: boolean

    @Prop({ default: true })
    showResultsImmediately: boolean

    @Prop({ default: true })
    allowReview: boolean

    @Prop({ default: 1 })
    maxAttempts: number

    @Prop({ default: 60 })
    passingScore: number

    @Prop({ default: true })
    isPublic: boolean

    @Prop({ type: Object })
    accessControl: {
        requireAuthentication: boolean
        allowedUserGroups?: string[]
        password?: string
    }

    @Prop({ type: Object })
    gradingSettings: {
        penaltyForWrongAnswer: number
        bonusForQuickAnswer: boolean
        timeBasedScoring: boolean
    }
}

export type QuizSettingDoc = QuizSettingEntity & Document
export const QuizSettingSchema = SchemaFactory.createForClass(QuizSettingEntity)

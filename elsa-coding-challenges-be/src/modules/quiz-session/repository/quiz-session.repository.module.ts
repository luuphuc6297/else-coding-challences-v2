import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuizSessionEntity, QuizSessionSchema } from './entities/quiz-session.entity'
import { QuizSessionRepository } from './repositories/quiz-session.repository'

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: QuizSessionEntity.name,
                    schema: QuizSessionSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [QuizSessionRepository],
    providers: [QuizSessionRepository],
})
export class QuizSessionRepositoryModule {} 
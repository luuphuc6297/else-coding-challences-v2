import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuizEntity, QuizSchema } from './entities/quiz.entity'
import { QuizRepository } from './repositories/quiz.repository'

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: QuizEntity.name,
                    schema: QuizSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [QuizRepository],
    providers: [QuizRepository],
})
export class QuizRepositoryModule {}

import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuestionEntity, QuestionSchema } from './entities/question.entity'
import { QuestionRepository } from './repositories/question.repository'

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: QuestionEntity.name,
                    schema: QuestionSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [QuestionRepository],
    providers: [QuestionRepository],
})
export class QuestionRepositoryModule {} 
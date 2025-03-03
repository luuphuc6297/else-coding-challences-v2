import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuizSettingEntity, QuizSettingSchema } from './entities/quiz-setting.entity'
import { QuizSettingRepository } from './repositories/quiz-setting.repository'

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: QuizSettingEntity.name,
                    schema: QuizSettingSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [QuizSettingRepository],
    providers: [QuizSettingRepository],
})
export class QuizSettingRepositoryModule {}

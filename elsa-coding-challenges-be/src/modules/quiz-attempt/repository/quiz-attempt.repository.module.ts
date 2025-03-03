import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { QuizAttemptEntity, QuizAttemptSchema } from './entities/quiz-attempt.entity'
import { QuizAttemptRepository } from './repositories/quiz-attempt.repository'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: QuizAttemptEntity.name,
                schema: QuizAttemptSchema,
            },
        ]),
    ],
    providers: [QuizAttemptRepository],
    exports: [QuizAttemptRepository],
})
export class QuizAttemptRepositoryModule {}

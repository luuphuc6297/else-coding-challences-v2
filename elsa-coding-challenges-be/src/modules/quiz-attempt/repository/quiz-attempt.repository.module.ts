import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'
import {QuizAttemptEntity, QuizAttemptSchema} from './entities/quiz-attempt.entity'
import {QuizAttemptRepository} from './repositories/quiz-attempt.repository'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: QuizAttemptEntity.name,
          schema: QuizAttemptSchema,
        },
      ],
      repositories: [QuizAttemptRepository],
    }),
  ],
  exports: [QuizAttemptRepository],
})
export class QuizAttemptRepositoryModule {}

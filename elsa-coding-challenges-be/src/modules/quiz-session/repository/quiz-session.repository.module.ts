import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'
import {QuizSessionEntity, QuizSessionSchema} from './entities/quiz-session.entity'
import {QuizSessionRepository} from './repositories/quiz-session.repository'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: QuizSessionEntity.name,
          schema: QuizSessionSchema,
        },
      ],
      repositories: [QuizSessionRepository],
    }),
  ],
  exports: [QuizSessionRepository],
})
export class QuizSessionRepositoryModule {}

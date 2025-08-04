import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'
import {QuizEntity, QuizSchema} from './entities/quiz.entity'
import {QuizRepository} from './repositories/quiz.repository'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: QuizEntity.name,
          schema: QuizSchema,
        },
      ],
      repositories: [QuizRepository],
    }),
  ],
  exports: [QuizRepository],
})
export class QuizRepositoryModule {}

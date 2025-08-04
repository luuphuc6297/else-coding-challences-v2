import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'
import {QuestionEntity, QuestionSchema} from './entities/question.entity'
import {QuestionRepository} from './repositories/question.repository'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: QuestionEntity.name,
          schema: QuestionSchema,
        },
      ],
      repositories: [QuestionRepository],
    }),
  ],
  exports: [QuestionRepository],
})
export class QuestionRepositoryModule {}

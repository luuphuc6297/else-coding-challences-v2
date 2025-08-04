import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'
import {QuizSettingEntity, QuizSettingSchema} from './entities/quiz-setting.entity'
import {QuizSettingRepository} from './repositories/quiz-setting.repository'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: QuizSettingEntity.name,
          schema: QuizSettingSchema,
        },
      ],
      repositories: [QuizSettingRepository],
    }),
  ],
  exports: [QuizSettingRepository],
})
export class QuizSettingRepositoryModule {}

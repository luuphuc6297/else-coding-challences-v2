import {Module} from '@nestjs/common'
import {QuizSettingRepositoryModule} from './repository/quiz-setting.repository.module'
import {QuizSettingService} from './services/quiz-setting.service'

@Module({
  imports: [QuizSettingRepositoryModule],
  providers: [QuizSettingService],
  exports: [QuizSettingService],
})
export class QuizSettingModule {}

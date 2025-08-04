import {Module} from '@nestjs/common'
import {QuizAttemptRepositoryModule} from './repository/quiz-attempt.repository.module'
import {QuizAttemptService} from './services/quiz-attempt.service'

@Module({
  imports: [QuizAttemptRepositoryModule],
  controllers: [],
  providers: [QuizAttemptService],
  exports: [QuizAttemptService],
})
export class QuizAttemptModule {}

import {QuizAttemptController} from '@modules/quiz-attempt/controllers/quiz-attempt.controller'
import {QuizAttemptModule} from '@modules/quiz-attempt/quiz-attempt.module'
import {Module} from '@nestjs/common'

@Module({
  imports: [QuizAttemptModule],
  controllers: [QuizAttemptController],
  providers: [],
  exports: [],
})
export class RoutesQuizAttemptModule {}

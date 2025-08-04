import {Module} from '@nestjs/common'
import {QuizRepositoryModule} from './repository/quiz.repository.module'
import {QuizService} from './services/quiz.service'
import {QuizController} from './controllers/quiz.controller'
import {QuizGateway} from './gateways/quiz.gateway'
import {QuizStateManager} from './managers/quiz-state.manager'
import {JoinQuizHandler} from './commands/handlers/join-quiz.handler'
import {SubmitAnswerHandler} from './commands/handlers/submit-answer.handler'
import {LeaderboardObserver} from './observers/leaderboard.observer'
import {QuizSessionModule} from '@modules/quiz-session/quiz-session.module'
import {QuestionModule} from '@modules/question/question.module'
import {LeaderboardModule} from '@modules/leaderboard/leaderboard.module'
import {RedisModule} from '@infras/redis/redis.module'

@Module({
  imports: [QuizRepositoryModule, QuizSessionModule, QuestionModule, LeaderboardModule, RedisModule],
  controllers: [QuizController],
  providers: [QuizService, QuizGateway, QuizStateManager, JoinQuizHandler, SubmitAnswerHandler, LeaderboardObserver],
  exports: [QuizService, QuizStateManager, JoinQuizHandler, SubmitAnswerHandler],
})
export class QuizModule {}

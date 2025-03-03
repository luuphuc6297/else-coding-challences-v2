import { QuestionModule } from '@modules/question/question.module'
import { QuizSessionModule } from '@modules/quiz-session/quiz-session.module'
import { QuizSettingModule } from '@modules/quiz-setting/quiz-setting.module'
import { QuizModule } from '@modules/quiz/quiz.module'
import { Module } from '@nestjs/common'

@Module({
    imports: [QuizModule, QuizSettingModule, QuizSessionModule, QuestionModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class RoutesQuizModule {}

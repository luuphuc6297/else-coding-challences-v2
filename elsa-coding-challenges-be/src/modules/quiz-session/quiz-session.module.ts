import { Module } from '@nestjs/common'
import { QuizSessionRepositoryModule } from './repository/quiz-session.repository.module'
import { QuizSessionService } from './services/quiz-session.service'

@Module({
    imports: [QuizSessionRepositoryModule],
    providers: [QuizSessionService],
    exports: [QuizSessionService],
})
export class QuizSessionModule {} 
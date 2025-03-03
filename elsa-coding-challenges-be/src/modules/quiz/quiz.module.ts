import { Module } from '@nestjs/common'
import { QuizRepositoryModule } from './repository/quiz.repository.module'
import { QuizService } from './services/quiz.service'

@Module({
    imports: [QuizRepositoryModule],
    providers: [QuizService],
    exports: [QuizService],
})
export class QuizModule {}

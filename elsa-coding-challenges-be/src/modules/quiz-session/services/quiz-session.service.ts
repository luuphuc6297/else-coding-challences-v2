import { IDatabaseFindOneOptions } from '@infras/database/interfaces/database.interface'
import { QuizSessionDoc } from '@modules/quiz-session/repository/entities/quiz-session.entity'
import { QuizSessionRepository } from '@modules/quiz-session/repository/repositories/quiz-session.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class QuizSessionService {
    constructor(private readonly quizSessionRepository: QuizSessionRepository) {}

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<QuizSessionDoc> {
        return this.quizSessionRepository.findOne(find, options)
    }
}

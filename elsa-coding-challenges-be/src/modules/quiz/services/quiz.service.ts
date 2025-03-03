import { Injectable } from '@nestjs/common'
import { QuizRepository } from '../repository/repositories/quiz.repository'
import { IDatabaseFindOneOptions } from '@infras/database/interfaces/database.interface'
import { QuizDoc } from '../repository/entities/quiz.entity'

@Injectable()
export class QuizService {
    constructor(private readonly quizRepository: QuizRepository) {}

    async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<QuizDoc> {
        return this.quizRepository.findOne(find, options)
    }
}

import { IDatabaseFindOneOptions } from '@infras/database/interfaces/database.interface'
import { Injectable } from '@nestjs/common'
import { QuestionDoc } from '../repository/entities/question.entity'
import { QuestionRepository } from '../repository/repositories/question.repository'

@Injectable()
export class QuestionService {
    constructor(private readonly questionRepository: QuestionRepository) {}

    async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<QuestionDoc> {
        return this.questionRepository.findOne(find, options)
    }
}

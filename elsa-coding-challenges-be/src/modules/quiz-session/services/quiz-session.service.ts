import {
  IDatabaseCreateOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseManyOptions,
} from '@infras/database/interfaces/database.interface'
import {QuizSessionDoc, QuizSessionEntity} from '@modules/quiz-session/repository/entities/quiz-session.entity'
import {QuizSessionRepository} from '@modules/quiz-session/repository/repositories/quiz-session.repository'
import {Injectable} from '@nestjs/common'

@Injectable()
export class QuizSessionService {
  constructor(private readonly quizSessionRepository: QuizSessionRepository) {}

  async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<QuizSessionDoc> {
    return this.quizSessionRepository.findOne(find, options)
  }

  async findAll<T = QuizSessionDoc>(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<T[]> {
    return this.quizSessionRepository.findAll(find, options)
  }

  async create<Dto = Partial<QuizSessionEntity>>(data: Dto, options?: IDatabaseCreateOptions): Promise<QuizSessionDoc> {
    return this.quizSessionRepository.create(data, options)
  }

  async update<Dto = Partial<QuizSessionEntity>>(
    find: Record<string, any>,
    data: Dto,
    options?: IDatabaseManyOptions
  ): Promise<boolean> {
    return this.quizSessionRepository.updateMany(find, data, options)
  }
}

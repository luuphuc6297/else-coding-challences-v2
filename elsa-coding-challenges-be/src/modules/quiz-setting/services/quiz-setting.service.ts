import {IDatabaseFindOneOptions} from '@infras/database/interfaces/database.interface'
import {Injectable} from '@nestjs/common'
import {QuizSettingDoc} from '../repository/entities/quiz-setting.entity'
import {QuizSettingRepository} from '../repository/repositories/quiz-setting.repository'

@Injectable()
export class QuizSettingService {
  constructor(private readonly quizSettingRepository: QuizSettingRepository) {}

  async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<QuizSettingDoc> {
    return this.quizSettingRepository.findOne(find, options)
  }
}

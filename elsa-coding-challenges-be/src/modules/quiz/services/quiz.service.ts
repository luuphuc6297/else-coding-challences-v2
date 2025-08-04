import {DatabaseGenericServiceAbstract} from '@infras/database/abstracts/database.generic.service.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'
import {QuizDoc, QuizEntity} from '../repository/entities/quiz.entity'

@Injectable()
export class QuizService extends DatabaseGenericServiceAbstract<QuizEntity, QuizDoc> {
  constructor(
    @DatabaseModel(QuizEntity.name)
    private readonly quizModel: Model<QuizEntity>
  ) {
    super(quizModel)
  }
}

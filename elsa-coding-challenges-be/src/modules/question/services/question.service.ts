import {DatabaseGenericServiceAbstract} from '@infras/database/abstracts/database.generic.service.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'
import {QuestionDoc, QuestionEntity} from '../repository/entities/question.entity'

@Injectable()
export class QuestionService extends DatabaseGenericServiceAbstract<QuestionEntity, QuestionDoc> {
  constructor(
    @DatabaseModel(QuestionEntity.name)
    private readonly questionModel: Model<QuestionEntity>
  ) {
    super(questionModel)
  }
}

import {DatabaseMongoObjectIdRepositoryAbstract} from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'
import {QuizDoc, QuizEntity} from '../entities/quiz.entity'

@Injectable()
export class QuizRepository extends DatabaseMongoObjectIdRepositoryAbstract<QuizEntity, QuizDoc> {
  constructor(
    @DatabaseModel(QuizEntity.name)
    private readonly quizModel: Model<QuizEntity>
  ) {
    super(quizModel)
  }
}

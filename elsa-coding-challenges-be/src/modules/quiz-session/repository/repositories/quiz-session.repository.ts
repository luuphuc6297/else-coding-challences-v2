import {DatabaseMongoObjectIdRepositoryAbstract} from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import {DatabaseModel} from '@infras/database/decorators/database.decorator'
import {Injectable} from '@nestjs/common'
import {Model} from 'mongoose'
import {QuizSessionDoc, QuizSessionEntity} from '../entities/quiz-session.entity'

@Injectable()
export class QuizSessionRepository extends DatabaseMongoObjectIdRepositoryAbstract<QuizSessionEntity, QuizSessionDoc> {
  constructor(
    @DatabaseModel(QuizSessionEntity.name)
    private readonly quizSessionModel: Model<QuizSessionEntity>
  ) {
    super(quizSessionModel)
  }
}

import {DatabaseMongoObjectIdRepositoryAbstract} from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model} from 'mongoose'
import {QuizAttemptDoc, QuizAttemptEntity} from '../entities/quiz-attempt.entity'

@Injectable()
export class QuizAttemptRepository extends DatabaseMongoObjectIdRepositoryAbstract<QuizAttemptEntity, QuizAttemptDoc> {
  constructor(
    @InjectModel(QuizAttemptEntity.name)
    private readonly quizAttemptModel: Model<QuizAttemptDoc>
  ) {
    super(quizAttemptModel)
  }
}

import { DatabaseMongoObjectIdRepositoryAbstract } from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import { DatabaseModel } from '@infras/database/decorators/database.decorator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { QuestionDoc, QuestionEntity } from '../entities/question.entity'

@Injectable()
export class QuestionRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    QuestionEntity,
    QuestionDoc
> {
    constructor(
        @DatabaseModel(QuestionEntity.name)
        private readonly questionModel: Model<QuestionEntity>
    ) {
        super(questionModel)
    }
} 
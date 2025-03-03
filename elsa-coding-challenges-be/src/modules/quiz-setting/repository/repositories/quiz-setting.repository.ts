import { DatabaseMongoObjectIdRepositoryAbstract } from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import { DatabaseModel } from '@infras/database/decorators/database.decorator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { QuizSettingDoc, QuizSettingEntity } from '../entities/quiz-setting.entity'

@Injectable()
export class QuizSettingRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    QuizSettingEntity,
    QuizSettingDoc
> {
    constructor(
        @DatabaseModel(QuizSettingEntity.name)
        private readonly QuizSettingModel: Model<QuizSettingEntity>
    ) {
        super(QuizSettingModel)
    }
}

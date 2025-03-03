import { DatabaseMongoObjectIdRepositoryAbstract } from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import { DatabaseModel } from '@infras/database/decorators/database.decorator'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { LeaderboardDoc, LeaderboardEntity } from '../entities/leaderboard.entity'

@Injectable()
export class LeaderboardRepository extends DatabaseMongoObjectIdRepositoryAbstract<
    LeaderboardEntity,
    LeaderboardDoc
> {
    constructor(
        @DatabaseModel(LeaderboardEntity.name)
        private readonly leaderboardModel: Model<LeaderboardEntity>
    ) {
        super(leaderboardModel)
    }
}

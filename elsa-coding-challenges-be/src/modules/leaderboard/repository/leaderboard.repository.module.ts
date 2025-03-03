import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LeaderboardEntity, LeaderboardSchema } from './entities/leaderboard.entity'
import { LeaderboardRepository } from './repositories/leaderboard.repository'

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: LeaderboardEntity.name,
                    schema: LeaderboardSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
    exports: [LeaderboardRepository],
    providers: [LeaderboardRepository],
})
export class LeaderboardRepositoryModule {}

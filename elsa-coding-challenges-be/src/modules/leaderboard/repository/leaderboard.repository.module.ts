import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {Module} from '@nestjs/common'
import {LeaderboardEntity, LeaderboardSchema} from './entities/leaderboard.entity'
import {LeaderboardRepository} from './repositories/leaderboard.repository'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: LeaderboardEntity.name,
          schema: LeaderboardSchema,
        },
      ],
      repositories: [LeaderboardRepository],
    }),
  ],
  exports: [LeaderboardRepository],
})
export class LeaderboardRepositoryModule {}

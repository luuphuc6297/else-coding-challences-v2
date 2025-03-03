import { Module } from '@nestjs/common'
import { LeaderboardRepositoryModule } from './repository/leaderboard.repository.module'
import { LeaderboardService } from './services/leaderboard.service'

@Module({
    imports: [LeaderboardRepositoryModule],
    providers: [LeaderboardService],
    exports: [LeaderboardService],
})
export class LeaderboardModule {}

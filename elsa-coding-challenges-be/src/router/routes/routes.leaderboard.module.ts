import { LeaderboardModule } from '@modules/leaderboard/leaderboard.module'
import { Module } from '@nestjs/common'
@Module({
    imports: [LeaderboardModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class RoutesLeaderboardModule {}

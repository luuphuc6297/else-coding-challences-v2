import { IDatabaseFindOneOptions } from '@infras/database/interfaces/database.interface'
import { Injectable } from '@nestjs/common'
import { LeaderboardDoc } from '../repository/entities/leaderboard.entity'
import { LeaderboardRepository } from '../repository/repositories/leaderboard.repository'

@Injectable()
export class LeaderboardService {
    constructor(private readonly leaderboardRepository: LeaderboardRepository) {}

    async findOne(
        find: Record<string, any>,
        options?: IDatabaseFindOneOptions
    ): Promise<LeaderboardDoc> {
        return this.leaderboardRepository.findOne(find, options)
    }
} 
import {IDatabaseFindOneOptions, IDatabaseManyOptions} from '@infras/database/interfaces/database.interface'
import {Injectable} from '@nestjs/common'
import {LeaderboardDoc, LeaderboardEntity} from '../repository/entities/leaderboard.entity'
import {LeaderboardRepository} from '../repository/repositories/leaderboard.repository'

@Injectable()
export class LeaderboardService {
  constructor(private readonly leaderboardRepository: LeaderboardRepository) {}

  async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<LeaderboardDoc> {
    return this.leaderboardRepository.findOne(find, options)
  }

  async update<Dto = Partial<LeaderboardEntity>>(
    find: Record<string, any>,
    data: Dto,
    options?: IDatabaseManyOptions
  ): Promise<boolean> {
    return this.leaderboardRepository.updateMany(find, data, options)
  }
}

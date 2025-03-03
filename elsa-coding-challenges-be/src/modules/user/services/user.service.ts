import { IDatabaseFindOneOptions } from '@infras/database/interfaces/database.interface'
import { Injectable } from '@nestjs/common'
import { UserDoc } from '../repository/entities/user.entity'
import { UserRepository } from '../repository/repositories/user.repository'

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<UserDoc> {
        return this.userRepository.findOne(find, options)
    }
} 
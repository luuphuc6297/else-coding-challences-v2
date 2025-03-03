import { DatabaseMongoObjectIdRepositoryAbstract } from '@infras/database/abstracts/mongo/repositories/database.mongo.object-id.repository.abstract'
import { DatabaseModel } from '@infras/database/decorators/database.decorator'
import { RoleDoc, RoleEntity } from '@infras/role/repository/entities/role.entity'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

@Injectable()
export class RoleRepository extends DatabaseMongoObjectIdRepositoryAbstract<RoleEntity, RoleDoc> {
    constructor(
        @DatabaseModel(RoleEntity.name)
        private readonly roleModel: Model<RoleEntity>
    ) {
        super(roleModel)
    }
}

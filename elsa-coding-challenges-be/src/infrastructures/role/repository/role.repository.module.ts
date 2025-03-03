import { DATABASE_CONNECTION_NAME } from '@infras/database/constants/database.constant'
import { RoleEntity, RoleSchema } from '@infras/role/repository/entities/role.entity'
import { RoleRepository } from '@infras/role/repository/repositories/role.repository'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    providers: [RoleRepository],
    exports: [RoleRepository],
    controllers: [],
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: RoleEntity.name,
                    schema: RoleSchema,
                },
            ],
            DATABASE_CONNECTION_NAME
        ),
    ],
})
export class RoleRepositoryModule {}

import {BaseRepositoryModule} from '@infras/database/base-repository.module'
import {RoleEntity, RoleSchema} from '@infras/role/repository/entities/role.entity'
import {RoleRepository} from '@infras/role/repository/repositories/role.repository'
import {Module} from '@nestjs/common'

@Module({
  imports: [
    BaseRepositoryModule.forFeature({
      entities: [
        {
          name: RoleEntity.name,
          schema: RoleSchema,
        },
      ],
      repositories: [RoleRepository],
    }),
  ],
  exports: [RoleRepository],
})
export class RoleRepositoryModule {}

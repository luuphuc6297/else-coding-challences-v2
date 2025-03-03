import { RoleRepositoryModule } from '@infras/role/repository/role.repository.module'
import { Module } from '@nestjs/common'
import { RoleService } from './services/role.service'

@Module({
    controllers: [],
    providers: [RoleService],
    exports: [RoleService],
    imports: [RoleRepositoryModule],
})
export class RoleModule {}

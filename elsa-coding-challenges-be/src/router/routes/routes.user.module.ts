import { ApiKeyModule } from '@infras/api-key/api-key.module'
import { ApiKeyUserController } from '@infras/api-key/controllers/api-key.user.controller'
import { RoleModule } from '@infras/role/role.module'
import { Module } from '@nestjs/common'

@Module({
    controllers: [ApiKeyUserController],
    providers: [],
    exports: [],
    imports: [ApiKeyModule, RoleModule],
})
export class RoutesUserModule {}

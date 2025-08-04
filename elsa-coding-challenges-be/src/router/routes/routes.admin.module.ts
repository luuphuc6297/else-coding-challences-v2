import {ApiKeyModule} from '@infras/api-key/api-key.module'
import {ApiKeyAdminController} from '@infras/api-key/controllers/api-key.admin.controller'
import {AuthModule} from '@infras/auth/auth.module'
import {RoleAdminController} from '@infras/role/controllers/role.admin.controller'
import {RoleModule} from '@infras/role/role.module'
import {Module} from '@nestjs/common'

@Module({
  controllers: [ApiKeyAdminController, RoleAdminController],
  providers: [],
  exports: [],
  imports: [ApiKeyModule, AuthModule, RoleModule],
})
export class RoutesAdminModule {}

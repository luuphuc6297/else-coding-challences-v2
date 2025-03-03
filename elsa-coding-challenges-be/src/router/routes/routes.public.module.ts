import { AuthModule } from '@infras/auth/auth.module'
import { MessagePublicController } from '@infras/message/controllers/message.public.controller'
import { RoleModule } from '@infras/role/role.module'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

@Module({
    controllers: [MessagePublicController],
    providers: [],
    exports: [],
    imports: [TerminusModule, AuthModule, RoleModule],
})
export class RoutesPublicModule {}

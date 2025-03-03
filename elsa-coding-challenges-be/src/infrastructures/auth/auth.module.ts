import { AuthJwtAccessStrategy } from '@infras/auth/guards/jwt-access/auth.jwt-access.strategy'
import { AuthJwtRefreshStrategy } from '@infras/auth/guards/jwt-refresh/auth.jwt-refresh.strategy'
import { AuthService } from '@infras/auth/services/auth.service'
import { Module } from '@nestjs/common'

@Module({
    providers: [AuthService, AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
    exports: [AuthService],
    controllers: [],
    imports: [],
})
export class AuthModule {}

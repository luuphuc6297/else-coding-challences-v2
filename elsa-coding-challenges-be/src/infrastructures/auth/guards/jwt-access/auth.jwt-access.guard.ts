import { ENUM_AUTH_STATUS_CODE_ERROR } from '@infras/auth/constants/auth.status-code.constant'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwt') {
    handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
        if (err || !user) {
            throw new UnauthorizedException({
                statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_ACCESS_TOKEN_ERROR,
                message: 'auth.error.accessTokenUnauthorized',
                _error: err ? err.message : info.message,
            })
        }

        return user
    }
}

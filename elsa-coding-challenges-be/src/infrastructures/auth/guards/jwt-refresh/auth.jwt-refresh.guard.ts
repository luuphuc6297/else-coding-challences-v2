import {ENUM_AUTH_STATUS_CODE_ERROR} from '@infras/auth/constants/auth.status-code.constant'
import {Injectable, UnauthorizedException} from '@nestjs/common'
import {AuthGuard} from '@nestjs/passport'

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwtRefresh') {
  handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_JWT_REFRESH_TOKEN_ERROR,
        message: 'auth.error.refreshTokenUnauthorized',
        _error: err ? err.message : info.message,
      })
    }

    return user
  }
}

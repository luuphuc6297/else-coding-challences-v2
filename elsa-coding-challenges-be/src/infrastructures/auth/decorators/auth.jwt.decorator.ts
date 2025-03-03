import { AuthJwtAccessGuard } from '@infras/auth/guards/jwt-access/auth.jwt-access.guard'
import { AuthJwtRefreshGuard } from '@infras/auth/guards/jwt-refresh/auth.jwt-refresh.guard'
import { IRequestApp } from '@infras/request/interfaces/request.interface'
import { ROLE_TYPE_META_KEY } from '@infras/role/constants/role.constant'
import { ENUM_ROLE_TYPE } from '@infras/role/constants/role.enum.constant'
import { RolePayloadTypeGuard } from '@infras/role/guards/payload/role.payload.type.guard'
import { UserPayloadSerialization } from '@modules/user/serializations/user.payload.serialization'
import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common'

export const AuthJwtPayload = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { user: UserPayloadSerialization }>()
        return data ? user[data] : user
    }
)

export const AuthJwtToken = createParamDecorator((data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest<IRequestApp>()
    const { authorization } = headers
    const authorizations: string[] = (authorization ?? '').split(' ')

    return authorizations.length >= 2 ? authorizations[1] : ''
})

export function AuthJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard))
}

export function AuthJwtPublicAccessProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
        SetMetadata(ROLE_TYPE_META_KEY, [ENUM_ROLE_TYPE.USER])
    )
}

export function AuthJwtAdminAccessProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard, RolePayloadTypeGuard),
        SetMetadata(ROLE_TYPE_META_KEY, [ENUM_ROLE_TYPE.SUPER_ADMIN, ENUM_ROLE_TYPE.ADMIN])
    )
}

export function AuthJwtRefreshProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtRefreshGuard))
}

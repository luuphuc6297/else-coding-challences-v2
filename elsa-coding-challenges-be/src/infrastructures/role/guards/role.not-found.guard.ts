import { IRequestApp } from '@infras/request/interfaces/request.interface'
import { ENUM_ROLE_STATUS_CODE_ERROR } from '@infras/role/constants/role.status-code.constant'
import { RoleDoc } from '@infras/role/repository/entities/role.entity'
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class RoleNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __role } = context.switchToHttp().getRequest<IRequestApp & { __role: RoleDoc }>()

        if (!__role) {
            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            })
        }

        return true
    }
}

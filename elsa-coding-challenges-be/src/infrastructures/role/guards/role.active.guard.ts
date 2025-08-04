import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {ROLE_ACTIVE_META_KEY} from '@infras/role/constants/role.constant'
import {ENUM_ROLE_STATUS_CODE_ERROR} from '@infras/role/constants/role.status-code.constant'
import {RoleDoc} from '@infras/role/repository/entities/role.entity'
import {BadRequestException, CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {Reflector} from '@nestjs/core'

@Injectable()
export class RoleActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(ROLE_ACTIVE_META_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!required) {
      return true
    }

    const {__role} = context.switchToHttp().getRequest<IRequestApp & {__role: RoleDoc}>()

    if (!required.includes(__role.isActive)) {
      throw new BadRequestException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_ACTIVE_ERROR,
        message: 'role.error.isActiveInvalid',
      })
    }
    return true
  }
}

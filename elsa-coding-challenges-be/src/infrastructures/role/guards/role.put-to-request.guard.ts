import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {RoleDoc} from '@infras/role/repository/entities/role.entity'
import {RoleService} from '@infras/role/services/role.service'
import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'

@Injectable()
export class RolePutToRequestGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IRequestApp & {__role: RoleDoc}>()
    const {params} = request
    const role = params?.role

    const check: RoleDoc = await this.roleService.findOneById(role, {
      join: true,
      order: {},
    })
    request.__role = check

    return true
  }
}

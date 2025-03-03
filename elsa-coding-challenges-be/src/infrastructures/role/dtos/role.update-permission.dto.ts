import { RoleCreateDto } from '@infras/role/dtos/role.create.dto'
import { OmitType } from '@nestjs/swagger'

export class RoleUpdatePermissionDto extends OmitType(RoleCreateDto, ['name'] as const) {}

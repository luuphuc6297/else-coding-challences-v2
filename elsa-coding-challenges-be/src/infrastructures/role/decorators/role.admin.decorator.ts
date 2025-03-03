import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ROLE_ACTIVE_META_KEY } from '@infras/role/constants/role.constant';
import { RoleActiveGuard } from '@infras/role/guards/role.active.guard';
import { RoleNotFoundGuard } from '@infras/role/guards/role.not-found.guard';
import { RolePutToRequestGuard } from '@infras/role/guards/role.put-to-request.guard';

export function RoleAdminGetGuard(): MethodDecorator {
    return applyDecorators(UseGuards(RolePutToRequestGuard, RoleNotFoundGuard));
}

export function RoleAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_ACTIVE_META_KEY, [true])
    );
}

export function RoleAdminDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_ACTIVE_META_KEY, [true])
    );
}

export function RoleAdminUpdateActiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_ACTIVE_META_KEY, [false])
    );
}

export function RoleAdminUpdateInactiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_ACTIVE_META_KEY, [true])
    );
}

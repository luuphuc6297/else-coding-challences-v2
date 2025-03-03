import { POLICY_RULE_META_KEY } from '@infras/policy/constants/policy.constant'
import { ENUM_POLICY_STATUS_CODE_ERROR } from '@infras/policy/constants/policy.status-code.constant'
import { PolicyAbilityFactory } from '@infras/policy/factories/policy.ability.factory'
import {
    IPolicyAbility,
    IPolicyRule,
    PolicyHandler,
} from '@infras/policy/interfaces/policy.interface'
import { RoleDoc } from '@infras/role/repository/entities/role.entity'
import { RoleService } from '@infras/role/services/role.service'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly policyAbilityFactory: PolicyAbilityFactory,
        private readonly roleService: RoleService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyRule =
            this.reflector.get<IPolicyRule[]>(POLICY_RULE_META_KEY, context.getHandler()) || []

        const { user } = context.switchToHttp().getRequest()
        const role: RoleDoc = await this.roleService.findOneById(user.role)
        const ability = this.policyAbilityFactory.defineAbilityFromRole(role)

        const policyHandler: PolicyHandler[] = this.policyAbilityFactory.mappingRules(policyRule)
        const check: boolean = policyHandler.every((handler: PolicyHandler) => {
            return this.execPolicyHandler(handler, ability)
        })

        if (!check) {
            throw new ForbiddenException({
                statusCode: ENUM_POLICY_STATUS_CODE_ERROR.POLICY_ABILITY_FORBIDDEN_ERROR,
                message: 'policy.error.abilityForbidden',
            })
        }

        return true
    }

    private execPolicyHandler(handler: PolicyHandler, ability: IPolicyAbility) {
        if (typeof handler === 'function') {
            return handler(ability)
        }
        return handler.handle(ability)
    }
}

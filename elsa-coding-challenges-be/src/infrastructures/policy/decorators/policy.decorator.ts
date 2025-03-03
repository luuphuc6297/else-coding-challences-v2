import { POLICY_RULE_META_KEY } from '@infras/policy/constants/policy.constant'
import { PolicyGuard } from '@infras/policy/guards/policy.ability.guard'
import { IPolicyRule } from '@infras/policy/interfaces/policy.interface'
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'

export function PolicyAbilityProtected(...handlers: IPolicyRule[]): MethodDecorator {
    return applyDecorators(UseGuards(PolicyGuard), SetMetadata(POLICY_RULE_META_KEY, handlers))
}

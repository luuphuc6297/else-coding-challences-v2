import {PolicyAbilityFactory} from '@infras/policy/factories/policy.ability.factory'
import {Global, Module} from '@nestjs/common'

@Global()
@Module({
  providers: [PolicyAbilityFactory],
  exports: [PolicyAbilityFactory],
  imports: [],
})
export class PolicyModule {}

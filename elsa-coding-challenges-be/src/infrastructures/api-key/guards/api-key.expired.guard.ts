import { ENUM_API_KEY_STATUS_CODE_ERROR } from '@infras/api-key/constants/api-key.status-code.constant'
import { HelperDateService } from '@infras/helper/services/helper.date.service'
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class ApiKeyExpiredGuard implements CanActivate {
    constructor(private readonly helperDateService: HelperDateService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __apiKey } = context.switchToHttp().getRequest()
        const today: Date = this.helperDateService.create()

        if (__apiKey.startDate && __apiKey.endDate && today > __apiKey.endDate) {
            throw new BadRequestException({
                statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR,
                message: 'apiKey.error.expired',
            })
        }
        return true
    }
}

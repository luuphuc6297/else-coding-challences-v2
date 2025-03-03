import { ApiKeyDoc } from '@infras/api-key/repository/entities/api-key.entity'
import { ApiKeyService } from '@infras/api-key/services/api-key.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class ApiKeyPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly apiKeyService: ApiKeyService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { params, user } = request
        const { _id } = user
        const { apiKey } = params

        const check: ApiKeyDoc = await this.apiKeyService.findOneByIdAndUser(_id, apiKey)
        request.__apiKey = check

        return true
    }
}

import { ENUM_API_KEY_STATUS_CODE_ERROR } from '@infras/api-key/constants/api-key.status-code.constant'
import { ApiKeyEntity } from '@infras/api-key/repository/entities/api-key.entity'
import { ApiKeyService } from '@infras/api-key/services/api-key.service'
import { HelperDateService } from '@infras/helper/services/helper.date.service'
import { IRequestApp } from '@infras/request/interfaces/request.interface'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import Strategy from 'passport-headerapikey'

@Injectable()
export class ApiKeyXApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
    constructor(
        private readonly apiKeyService: ApiKeyService,
        private readonly helperDateService: HelperDateService
    ) {
        super({ header: 'X-API-KEY', prefix: '' }, true)
    }

    async validate(
        req: IRequestApp,
        apiKey: string,
        done: (error: Error | null, user?: ApiKeyEntity) => void
    ): Promise<void> {
        const xApiKey: string[] = apiKey.split(':')
        if (xApiKey.length !== 2) {
            done(new Error(`${ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_INVALID_ERROR}`), undefined)
            return
        }

        const key = xApiKey[0]
        const secret = xApiKey[1]
        const today = this.helperDateService.create()
        const authApi: ApiKeyEntity = await this.apiKeyService.findOneByActiveKey(key)

        if (!authApi) {
            done(new Error(`${ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_NOT_FOUND_ERROR}`), undefined)
            return
        } else if (!authApi.isActive) {
            done(new Error(`${ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_IS_ACTIVE_ERROR}`), undefined)
            return
        } else if (
            authApi.startDate &&
            authApi.endDate &&
            (authApi.startDate < today || authApi.endDate > today)
        ) {
            done(new Error(`${ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR}`), undefined)
        }

        const hashed = await this.apiKeyService.createHashApiKey(key, secret)
        const validateApiKey: boolean = await this.apiKeyService.validateHashApiKey(
            hashed,
            authApi.hash
        )
        if (!validateApiKey) {
            done(new Error(`${ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_INVALID_ERROR}`), undefined)
            return
        }

        req.apiKey = {
            _id: `${authApi._id}`,
            key: authApi.key,
            name: authApi.name,
        }
        done(null, authApi)

        return
    }
}

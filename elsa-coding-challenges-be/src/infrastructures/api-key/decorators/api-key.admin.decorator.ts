import { API_KEY_ACTIVE_META_KEY } from '@infras/api-key/constants/api-key.constant'
import { ApiKeyActiveGuard } from '@infras/api-key/guards/api-key.active.guard'
import { ApiKeyExpiredGuard } from '@infras/api-key/guards/api-key.expired.guard'
import { ApiKeyNotFoundGuard } from '@infras/api-key/guards/api-key.not-found.guard'
import { ApiKeyPutToRequestGuard } from '@infras/api-key/guards/api-key.put-to-request.guard'
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

export function ApiKeyAdminGetGuard(): MethodDecorator {
    return applyDecorators(UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard))
}

export function ApiKeyAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
    )
}

export function ApiKeyAdminUpdateResetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
    )
}

export function ApiKeyAdminUpdateActiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [false])
    )
}

export function ApiKeyAdminUpdateInactiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
    )
}

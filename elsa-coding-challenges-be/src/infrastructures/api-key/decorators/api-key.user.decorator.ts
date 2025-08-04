import {API_KEY_ACTIVE_META_KEY} from '@infras/api-key/constants/api-key.constant'
import {ApiKeyActiveGuard} from '@infras/api-key/guards/api-key.active.guard'
import {ApiKeyExpiredGuard} from '@infras/api-key/guards/api-key.expired.guard'
import {ApiKeyNotFoundGuard} from '@infras/api-key/guards/api-key.not-found.guard'
import {ApiKeyPayloadPutToRequestGuard} from '@infras/api-key/guards/payload/api-key.put-to-request.guard'
import {applyDecorators, SetMetadata, UseGuards} from '@nestjs/common'

export function ApiKeyUserGetGuard(): MethodDecorator {
  return applyDecorators(UseGuards(ApiKeyPayloadPutToRequestGuard, ApiKeyNotFoundGuard))
}

export function ApiKeyUserUpdateGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyPayloadPutToRequestGuard, ApiKeyNotFoundGuard, ApiKeyActiveGuard, ApiKeyExpiredGuard),
    SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
  )
}

export function ApiKeyUserUpdateResetGuard(): MethodDecorator {
  return applyDecorators(
    UseGuards(ApiKeyPayloadPutToRequestGuard, ApiKeyNotFoundGuard, ApiKeyActiveGuard, ApiKeyExpiredGuard),
    SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
  )
}

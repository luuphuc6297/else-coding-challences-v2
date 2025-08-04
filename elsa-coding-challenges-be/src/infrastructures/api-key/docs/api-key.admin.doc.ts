import {ApiKeyDocParamsGet, ApiKeyDocQueryIsActive} from '@infras/api-key/constants/api-key.doc'
import {ApiKeyGetSerialization} from '@infras/api-key/serializations/api-key.get.serialization'
import {ApiKeyListSerialization} from '@infras/api-key/serializations/api-key.list.serialization'
import {Doc, DocPaging} from '@infras/doc/decorators/doc.decorator'
import {ResponseIdSerialization} from '@infras/response/serializations/response.id.serialization'
import {ApiKeyCreateSerialization} from '@infras/api-key/serializations/api-key.create.serialization'
import {applyDecorators, HttpStatus} from '@nestjs/common'

export function ApiKeyListDoc(): MethodDecorator {
  return applyDecorators(
    DocPaging<ApiKeyListSerialization>('apiKey.list', {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        queries: ApiKeyDocQueryIsActive,
      },
      response: {
        serialization: ApiKeyListSerialization,
      },
    })
  )
}

export function ApiKeyGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc<ApiKeyGetSerialization>('apiKey.get', {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        params: ApiKeyDocParamsGet,
      },
      response: {serialization: ApiKeyGetSerialization},
    })
  )
}

export function ApiKeyCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc<ApiKeyCreateSerialization>('apiKey.create', {
      auth: {
        jwtAccessToken: true,
      },
      response: {
        httpStatus: HttpStatus.CREATED,
        serialization: ApiKeyCreateSerialization,
      },
    })
  )
}

export function ApiKeyActiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc<void>('apiKey.active', {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        params: ApiKeyDocParamsGet,
      },
    })
  )
}

export function ApiKeyInactiveDoc(): MethodDecorator {
  return applyDecorators(
    Doc<void>('apiKey.inactive', {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        params: ApiKeyDocParamsGet,
      },
    })
  )
}

export function ApiKeyResetDoc(): MethodDecorator {
  return applyDecorators(
    Doc<void>('apiKey.reset', {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        params: ApiKeyDocParamsGet,
      },
      response: {
        serialization: ApiKeyCreateSerialization,
      },
    })
  )
}

export function ApiKeyUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc<ResponseIdSerialization>('apiKey.update', {
      auth: {
        jwtAccessToken: true,
      },
      request: {
        params: ApiKeyDocParamsGet,
      },
      response: {
        serialization: ResponseIdSerialization,
      },
    })
  )
}

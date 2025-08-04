import {
  API_KEY_DEFAULT_AVAILABLE_ORDER_BY,
  API_KEY_DEFAULT_AVAILABLE_SEARCH,
  API_KEY_DEFAULT_IS_ACTIVE,
  API_KEY_DEFAULT_ORDER_BY,
  API_KEY_DEFAULT_ORDER_DIRECTION,
  API_KEY_DEFAULT_PER_PAGE,
} from '@infras/api-key/constants/api-key.list.constant'
import {ENUM_API_KEY_STATUS_CODE_ERROR} from '@infras/api-key/constants/api-key.status-code.constant'
import {
  ApiKeyAdminGetGuard,
  ApiKeyAdminUpdateActiveGuard,
  ApiKeyAdminUpdateGuard,
  ApiKeyAdminUpdateInactiveGuard,
  ApiKeyAdminUpdateResetGuard,
} from '@infras/api-key/decorators/api-key.admin.decorator'
import {GetApiKey} from '@infras/api-key/decorators/api-key.decorator'
import {
  ApiKeyActiveDoc,
  ApiKeyCreateDoc,
  ApiKeyGetDoc,
  ApiKeyInactiveDoc,
  ApiKeyListDoc,
  ApiKeyResetDoc,
  ApiKeyUpdateDoc,
} from '@infras/api-key/docs/api-key.admin.doc'
import {ApiKeyCreateDto} from '@infras/api-key/dtos/api-key.create.dto'
import {ApiKeyRequestDto} from '@infras/api-key/dtos/api-key.request.dto'
import {ApiKeyUpdateDateDto} from '@infras/api-key/dtos/api-key.update-date.dto'
import {ApiKeyUpdateDto} from '@infras/api-key/dtos/api-key.update.dto'
import {IApiKeyCreated} from '@infras/api-key/interfaces/api-key.interface'
import {ApiKeyDoc, ApiKeyEntity} from '@infras/api-key/repository/entities/api-key.entity'
import {ApiKeyCreateSerialization} from '@infras/api-key/serializations/api-key.create.serialization'
import {ApiKeyGetSerialization} from '@infras/api-key/serializations/api-key.get.serialization'
import {ApiKeyListSerialization} from '@infras/api-key/serializations/api-key.list.serialization'
import {ApiKeyResetSerialization} from '@infras/api-key/serializations/api-key.reset.serialization'
import {ApiKeyService} from '@infras/api-key/services/api-key.service'
import {AuthJwtAdminAccessProtected} from '@infras/auth/decorators/auth.jwt.decorator'
import {ENUM_ERROR_STATUS_CODE_ERROR} from '@infras/error/constants/error.status-code.constant'
import {PaginationQuery, PaginationQueryFilterInBoolean} from '@infras/pagination/decorators/pagination.decorator'
import {PaginationListDto} from '@infras/pagination/dtos/pagination.list.dto'
import {PaginationService} from '@infras/pagination/services/pagination.service'
import {ENUM_POLICY_ACTION, ENUM_POLICY_SUBJECT} from '@infras/policy/constants/policy.enum.constant'
import {PolicyAbilityProtected} from '@infras/policy/decorators/policy.decorator'
import {RequestParamGuard} from '@infras/request/decorators/request.decorator'
import {Response, ResponsePaging} from '@infras/response/decorators/response.decorator'
import {IResponse, IResponsePaging} from '@infras/response/interfaces/response.interface'
import {ResponseIdSerialization} from '@infras/response/serializations/response.id.serialization'
import {Body, ConflictException, Controller, Get, InternalServerErrorException, Patch, Post, Put} from '@nestjs/common'
import {ApiTags} from '@nestjs/swagger'

@ApiTags('common.apiKey.admin')
@Controller({
  version: '1',
  path: '/api-key',
})
export class ApiKeyAdminController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly paginationService: PaginationService
  ) {}

  @ApiKeyListDoc()
  @ResponsePaging('apiKey.list', {
    serialization: ApiKeyListSerialization,
  })
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @Get('/list')
  async list(
    @PaginationQuery(
      API_KEY_DEFAULT_PER_PAGE,
      API_KEY_DEFAULT_ORDER_BY,
      API_KEY_DEFAULT_ORDER_DIRECTION,
      API_KEY_DEFAULT_AVAILABLE_SEARCH,
      API_KEY_DEFAULT_AVAILABLE_ORDER_BY
    )
    {_search, _limit, _offset, _order}: PaginationListDto,
    @PaginationQueryFilterInBoolean('isActive', API_KEY_DEFAULT_IS_ACTIVE)
    isActive: Record<string, any>
  ): Promise<IResponsePaging> {
    const find: Record<string, any> = {
      ..._search,
      ...isActive,
    }

    const apiKeys: ApiKeyEntity[] = await this.apiKeyService.findAll(find, {
      paging: {
        limit: _limit,
        offset: _offset,
      },
      order: _order,
    })
    const total: number = await this.apiKeyService.getTotal(find)
    const totalPage: number = this.paginationService.totalPage(total, _limit)

    return {
      _pagination: {totalPage, total},
      data: apiKeys,
    }
  }

  @ApiKeyGetDoc()
  @Response('apiKey.get', {
    serialization: ApiKeyGetSerialization,
  })
  @ApiKeyAdminGetGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Get('get/:apiKey')
  async get(@GetApiKey(true) apiKey: ApiKeyEntity): Promise<IResponse> {
    return {data: apiKey}
  }

  @ApiKeyCreateDoc()
  @Response('apiKey.create', {serialization: ApiKeyCreateSerialization})
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
  })
  @AuthJwtAdminAccessProtected()
  @Post('/create')
  async create(@Body() {user, ...body}: ApiKeyCreateDto): Promise<IResponse> {
    const checkUser: boolean = await this.apiKeyService.existByUser(user)
    if (checkUser) {
      throw new ConflictException({
        statusCode: ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXIST_ERROR,
        message: 'apiKey.error.exist',
      })
    }

    try {
      const created: IApiKeyCreated = await this.apiKeyService.create({
        ...body,
        user,
      })

      return {
        data: {
          _id: created.doc._id,
          secret: created.secret,
        },
      }
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      })
    }
  }

  @ApiKeyResetDoc()
  @Response('apiKey.reset', {serialization: ApiKeyResetSerialization})
  @ApiKeyAdminUpdateResetGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Patch('/update/:apiKey/reset')
  async reset(@GetApiKey() apiKey: ApiKeyDoc): Promise<IResponse> {
    try {
      const secret: string = await this.apiKeyService.createSecret()
      const updated: ApiKeyDoc = await this.apiKeyService.reset(apiKey, secret)

      return {
        data: {
          _id: updated._id,
          secret,
        },
      }
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      })
    }
  }

  @ApiKeyUpdateDoc()
  @Response('apiKey.update', {serialization: ResponseIdSerialization})
  @ApiKeyAdminUpdateGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Put('/update/:apiKey')
  async updateName(@Body() body: ApiKeyUpdateDto, @GetApiKey() apiKey: ApiKeyDoc): Promise<IResponse> {
    try {
      await this.apiKeyService.update(apiKey, body)
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      })
    }

    return {data: {_id: apiKey._id}}
  }

  @ApiKeyInactiveDoc()
  @Response('apiKey.inactive')
  @ApiKeyAdminUpdateInactiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Patch('/update/:apiKey/inactive')
  async inactive(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
    try {
      await this.apiKeyService.inactive(apiKey)
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      })
    }

    return
  }

  @ApiKeyActiveDoc()
  @Response('apiKey.active')
  @ApiKeyAdminUpdateActiveGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Patch('/update/:apiKey/active')
  async active(@GetApiKey() apiKey: ApiKeyDoc): Promise<void> {
    try {
      await this.apiKeyService.active(apiKey)
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      })
    }

    return
  }

  @ApiKeyUpdateDoc()
  @Response('apiKey.updateDate', {serialization: ResponseIdSerialization})
  @ApiKeyAdminUpdateGuard()
  @PolicyAbilityProtected({
    subject: ENUM_POLICY_SUBJECT.API_KEY,
    action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
  })
  @AuthJwtAdminAccessProtected()
  @RequestParamGuard(ApiKeyRequestDto)
  @Put('/update/:apiKey/date')
  async updateDate(@Body() body: ApiKeyUpdateDateDto, @GetApiKey() apiKey: ApiKeyDoc): Promise<IResponse> {
    try {
      await this.apiKeyService.updateDate(apiKey, body)
    } catch (err: any) {
      throw new InternalServerErrorException({
        statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
        message: 'http.serverError.internalServerError',
        _error: err.message,
      })
    }

    return {data: {_id: apiKey._id}}
  }
}

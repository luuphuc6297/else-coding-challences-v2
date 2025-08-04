import {ApiKeyActiveDto} from '@infras/api-key/dtos/api-key.active.dto'
import {ApiKeyCreateByUserDto, ApiKeyCreateDto, ApiKeyCreateRawDto} from '@infras/api-key/dtos/api-key.create.dto'
import {ApiKeyUpdateDateDto} from '@infras/api-key/dtos/api-key.update-date.dto'
import {ApiKeyUpdateDto} from '@infras/api-key/dtos/api-key.update.dto'
import {IApiKeyCreated} from '@infras/api-key/interfaces/api-key.interface'
import {IApiKeyService} from '@infras/api-key/interfaces/api-key.service.interface'
import {ApiKeyDoc, ApiKeyEntity} from '@infras/api-key/repository/entities/api-key.entity'
import {ApiKeyRepository} from '@infras/api-key/repository/repositories/api-key.repository'
import {
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseManyOptions,
  IDatabaseOptions,
} from '@infras/database/interfaces/database.interface'
import {HelperDateService} from '@infras/helper/services/helper.date.service'
import {HelperHashService} from '@infras/helper/services/helper.hash.service'
import {HelperStringService} from '@infras/helper/services/helper.string.service'
import {Injectable} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Document, Types} from 'mongoose'

@Injectable()
export class ApiKeyService implements IApiKeyService {
  private readonly env: string

  constructor(
    private readonly helperStringService: HelperStringService,
    private readonly configService: ConfigService,
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {
    this.env = this.configService.get<string>('app.env') ?? 'development'
  }

  async findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.findAll<ApiKeyEntity>(find, options)
  }

  async findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOneById<ApiKeyDoc>(_id, options)
  }

  async findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>(find, options)
  }

  async findOneByKey(key: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>({key}, options)
  }

  async findOneByActiveKey(key: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>(
      {
        key,
        isActive: true,
      },
      options
    )
  }

  async findAllByUser(
    user: string,
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions
  ): Promise<ApiKeyEntity[]> {
    return this.apiKeyRepository.findAll<ApiKeyEntity>({...find, user}, options)
  }

  async findOneByIdAndUser(user: string, _id: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>({_id, user}, options)
  }

  async findOneByUser(user: string, find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>({...find, user}, options)
  }

  async findOneByKeyAndUser(user: string, key: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>({key, user}, options)
  }

  async findOneByActiveKeyAndUser(user: string, key: string, options?: IDatabaseFindOneOptions): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.findOne<ApiKeyDoc>(
      {
        key,
        isActive: true,
        user,
      },
      options
    )
  }

  async existByUser(user: string, options?: IDatabaseExistOptions): Promise<boolean> {
    return this.apiKeyRepository.exists(
      {
        user,
      },
      options
    )
  }

  async getTotal(find?: Record<string, any>, options?: IDatabaseOptions): Promise<number> {
    return this.apiKeyRepository.getTotal(find, options)
  }

  async getTotalByUser(user: string, find?: Record<string, any>, options?: IDatabaseOptions): Promise<number> {
    return this.apiKeyRepository.getTotal({...find, user}, options)
  }

  async create(
    {name, description, startDate, endDate, user}: ApiKeyCreateDto,
    options?: IDatabaseCreateOptions
  ): Promise<IApiKeyCreated> {
    const key = await this.createKey()
    const secret = await this.createSecret()
    const hash: string = await this.createHashApiKey(key, secret)

    const dto: ApiKeyEntity = new ApiKeyEntity()
    dto.user = user
    dto.name = name
    dto.description = description
    dto.key = key
    dto.hash = hash
    dto.isActive = true

    if (startDate && endDate) {
      dto.startDate = this.helperDateService.startOfDay(startDate)
      dto.endDate = this.helperDateService.endOfDay(endDate)
    }

    const created: ApiKeyDoc = await this.apiKeyRepository.create<ApiKeyEntity>(dto, options)

    return {doc: created, secret}
  }

  async createByUser(
    user: string,
    {name, description, startDate, endDate}: ApiKeyCreateByUserDto,
    options?: IDatabaseCreateOptions
  ): Promise<IApiKeyCreated> {
    const key = await this.createKey()
    const secret = await this.createSecret()
    const hash: string = await this.createHashApiKey(key, secret)

    const dto: ApiKeyEntity = new ApiKeyEntity()
    dto.user = user
    dto.name = name
    dto.description = description
    dto.key = key
    dto.hash = hash
    dto.isActive = true

    if (startDate && endDate) {
      dto.startDate = this.helperDateService.startOfDay(startDate)
      dto.endDate = this.helperDateService.endOfDay(endDate)
    }

    const created: ApiKeyDoc = await this.apiKeyRepository.create<ApiKeyEntity>(dto, options)

    return {doc: created, secret}
  }

  async createRaw(
    {name, description, key, secret, startDate, endDate, user}: ApiKeyCreateRawDto,
    options?: IDatabaseCreateOptions
  ): Promise<IApiKeyCreated> {
    const hash: string = await this.createHashApiKey(key, secret)

    const dto: ApiKeyEntity = new ApiKeyEntity()
    dto.user = user
    dto.name = name
    dto.description = description
    dto.key = key
    dto.hash = hash
    dto.isActive = true

    if (startDate && endDate) {
      dto.startDate = this.helperDateService.startOfDay(startDate)
      dto.endDate = this.helperDateService.endOfDay(endDate)
    }

    const created: ApiKeyDoc = await this.apiKeyRepository.create<ApiKeyEntity>(dto, options)

    return {doc: created, secret}
  }

  async active(repository: ApiKeyDoc): Promise<ApiKeyDoc> {
    repository.isActive = true
    return this.apiKeyRepository.save(
      repository as unknown as ApiKeyEntity & Document<string> & Document<Types.ObjectId>
    )
  }

  async inactive(repository: ApiKeyDoc): Promise<ApiKeyDoc> {
    repository.isActive = false
    return this.apiKeyRepository.save(
      repository as unknown as ApiKeyEntity & Document<string> & Document<Types.ObjectId>
    )
  }

  async update(repository: ApiKeyDoc, {name, description}: ApiKeyUpdateDto): Promise<ApiKeyDoc> {
    repository.name = name
    repository.description = description
    return this.apiKeyRepository.save(
      repository as unknown as ApiKeyEntity & Document<string> & Document<Types.ObjectId>
    )
  }

  async updateDate(repository: ApiKeyDoc, {startDate, endDate}: ApiKeyUpdateDateDto): Promise<ApiKeyDoc> {
    repository.startDate = this.helperDateService.startOfDay(startDate)
    repository.endDate = this.helperDateService.endOfDay(endDate)
    return this.apiKeyRepository.save(
      repository as unknown as ApiKeyEntity & Document<string> & Document<Types.ObjectId>
    )
  }

  async reset(repository: ApiKeyDoc, secret: string): Promise<ApiKeyDoc> {
    const hash: string = await this.createHashApiKey(repository.key, secret)
    repository.hash = hash
    return this.apiKeyRepository.save(
      repository as unknown as ApiKeyEntity & Document<string> & Document<Types.ObjectId>
    )
  }

  async delete(repository: ApiKeyDoc): Promise<ApiKeyDoc> {
    return this.apiKeyRepository.softDelete(
      repository as unknown as ApiKeyEntity & Document<string> & Document<Types.ObjectId> & {deletedAt?: Date}
    )
  }

  async validateHashApiKey(hashFromRequest: string, hash: string): Promise<boolean> {
    return this.helperHashService.sha256Compare(hashFromRequest, hash)
  }

  async createKey(): Promise<string> {
    return this.helperStringService.random(25, {
      safe: false,
      upperCase: true,
      prefix: `${this.env}_`,
    })
  }

  async createSecret(): Promise<string> {
    return this.helperStringService.random(35, {
      safe: false,
      upperCase: true,
    })
  }

  async createHashApiKey(key: string, secret: string): Promise<string> {
    return this.helperHashService.sha256(`${key}:${secret}`)
  }

  async deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions): Promise<boolean> {
    return this.apiKeyRepository.deleteMany(find, options)
  }

  async inactiveManyByEndDate(options?: IDatabaseManyOptions): Promise<boolean> {
    return this.apiKeyRepository.updateMany<ApiKeyActiveDto>(
      {
        endDate: {
          $lte: this.helperDateService.create(),
        },
        isActive: true,
      },
      {
        isActive: false,
      },
      options
    )
  }
}

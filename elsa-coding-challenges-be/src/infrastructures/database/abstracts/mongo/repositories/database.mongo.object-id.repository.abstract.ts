import {DatabaseBaseRepositoryAbstract} from '@infras/database/abstracts/database.base-repository.abstract'
import {DATABASE_DELETED_AT_FIELD_NAME} from '@infras/database/constants/database.constant'
import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseManyOptions,
  IDatabaseOptions,
  IDatabaseRawOptions,
  IDatabaseRestoreManyOptions,
  IDatabaseSoftDeleteManyOptions,
} from '@infras/database/interfaces/database.interface'
import {ClientSession, Document, Model, PipelineStage, PopulateOptions, Types} from 'mongoose'

export abstract class DatabaseMongoObjectIdRepositoryAbstract<
  Entity,
  EntityDocument,
> extends DatabaseBaseRepositoryAbstract<EntityDocument> {
  protected _repository: Model<Entity>
  protected _joinOnFind?: PopulateOptions | (string | PopulateOptions)[]

  constructor(repository: Model<Entity>, options?: PopulateOptions | (string | PopulateOptions)[]) {
    super()

    this._repository = repository
    this._joinOnFind = options
  }

  protected getPopulateOptions(options?: IDatabaseFindAllOptions<ClientSession>): PopulateOptions[] {
    const join = options?.join
    if (!join) return []
    if (typeof join === 'boolean' && this._joinOnFind) {
      return Array.isArray(this._joinOnFind)
        ? (this._joinOnFind as PopulateOptions[])
        : [this._joinOnFind as PopulateOptions]
    }
    if (typeof join === 'boolean') {
      return []
    }
    if (typeof join === 'string') {
      return [{path: join}]
    }
    if (Array.isArray(join)) {
      return join.map((opt) => {
        if (typeof opt === 'string') {
          return {path: opt}
        }
        return opt as PopulateOptions
      })
    }
    return [join as PopulateOptions]
  }

  async findAll<T = Entity>(
    find: Record<string, any> = {},
    options?: IDatabaseFindAllOptions<ClientSession>
  ): Promise<T[]> {
    const findAll = this._repository.find<Entity>(find)

    if (options?.withDeleted) {
      findAll.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      findAll.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.select) {
      findAll.select(options.select)
    }

    if (options?.paging) {
      findAll.limit(options.paging.limit).skip(options.paging.offset)
    }

    if (options?.order) {
      findAll.sort(options.order)
    }

    const populateOpts = this.getPopulateOptions(options)
    if (populateOpts.length > 0) {
      findAll.populate(populateOpts)
    }

    if (options?.session) {
      findAll.session(options.session)
    }

    return findAll.lean() as any
  }

  async findAllDistinct<T = Entity>(
    fieldDistinct: string,
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions<ClientSession>
  ): Promise<T[]> {
    const findAll = this._repository.distinct<string>(fieldDistinct, find)

    if (options?.withDeleted) {
      findAll.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      findAll.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.select) {
      findAll.select(options.select)
    }

    if (options?.paging) {
      findAll.limit(options.paging.limit).skip(options.paging.offset)
    }

    if (options?.order) {
      findAll.sort(options.order)
    }

    const populateOpts = this.getPopulateOptions(options)
    if (populateOpts.length > 0) {
      findAll.populate(populateOpts)
    }

    if (options?.session) {
      findAll.session(options.session)
    }

    return findAll.lean() as any
  }

  async findOne<T = EntityDocument>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<ClientSession>
  ): Promise<T> {
    const findOne = this._repository.findOne<EntityDocument>(find)

    if (options?.withDeleted) {
      findOne.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.select) {
      findOne.select(options.select)
    }

    if (options?.join !== undefined) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => findOne.populate(opt))
      }
    }

    if (options?.session) {
      findOne.session(options.session)
    }

    if (options?.order) {
      findOne.sort(options.order)
    }

    return findOne.exec() as any
  }

  async findOneById<T = EntityDocument>(_id: string, options?: IDatabaseFindOneOptions<ClientSession>): Promise<T> {
    const findOne = this._repository.findById<EntityDocument>(new Types.ObjectId(_id))

    if (options?.withDeleted) {
      findOne.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.select) {
      findOne.select(options.select)
    }

    if (options?.join !== undefined) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => findOne.populate(opt))
      }
    }

    if (options?.session) {
      findOne.session(options.session)
    }

    if (options?.order) {
      findOne.sort(options.order)
    }

    return findOne.exec() as any
  }

  async findOneAndLock<T = EntityDocument>(
    find: Record<string, any>,
    options?: IDatabaseFindOneOptions<ClientSession>
  ): Promise<T> {
    const findOne = this._repository.findOneAndUpdate<EntityDocument>(find, {
      new: true,
      useFindAndModify: false,
    })

    if (options?.withDeleted) {
      findOne.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.select) {
      findOne.select(options.select)
    }

    if (options?.join !== undefined) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => findOne.populate(opt))
      }
    }

    if (options?.session) {
      findOne.session(options.session)
    }

    if (options?.order) {
      findOne.sort(options.order)
    }

    return findOne.exec() as T
  }

  async findOneByIdAndLock<T = EntityDocument>(
    _id: string,
    options?: IDatabaseFindOneOptions<ClientSession>
  ): Promise<T> {
    const findOne = this._repository.findByIdAndUpdate(new Types.ObjectId(_id), {
      new: true,
      useFindAndModify: false,
    })

    if (options?.withDeleted) {
      findOne.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      findOne.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.select) {
      findOne.select(options.select)
    }

    if (options?.join !== undefined) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => findOne.populate(opt))
      }
    }

    if (options?.session) {
      findOne.session(options.session)
    }

    if (options?.order) {
      findOne.sort(options.order)
    }

    return findOne.exec() as T
  }

  async getTotal(find?: Record<string, any>, options?: IDatabaseOptions<ClientSession>): Promise<number> {
    const count = this._repository.countDocuments(find)

    if (options?.withDeleted) {
      count.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      count.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.session) {
      count.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => count.populate(opt))
      }
    }

    return count
  }

  async exists(find: Record<string, any>, options?: IDatabaseExistOptions<ClientSession>): Promise<boolean> {
    if (options?.excludeId) {
      find = {
        ...find,
        _id: {
          $nin: options?.excludeId.map((val) => new Types.ObjectId(val)) ?? [],
        },
      }
    }

    const exist = this._repository.exists(find)
    if (options?.withDeleted) {
      exist.or([
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
        {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
        },
      ])
    } else {
      exist.where(DATABASE_DELETED_AT_FIELD_NAME).exists(false)
    }

    if (options?.session) {
      exist.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => exist.populate(opt))
      }
    }

    const result = await exist
    return result ? true : false
  }

  async create<Dto = any>(data: Dto, options?: IDatabaseCreateOptions<ClientSession>): Promise<EntityDocument> {
    const dataCreate: Record<string, any> = data as any
    dataCreate._id = new Types.ObjectId(options?._id)

    const created = await this._repository.create([dataCreate], {
      session: options ? options.session : undefined,
    })

    return created[0] as EntityDocument
  }

  async save(repository: EntityDocument & Document<Types.ObjectId>): Promise<EntityDocument> {
    return repository.save()
  }

  async delete(repository: EntityDocument & Document<Types.ObjectId>): Promise<EntityDocument> {
    return repository.deleteOne()
  }

  async softDelete(
    repository: EntityDocument & Document<Types.ObjectId> & {deletedAt?: Date}
  ): Promise<EntityDocument> {
    repository.deletedAt = new Date()
    return repository.save()
  }

  async restore(repository: EntityDocument & Document<Types.ObjectId> & {deletedAt?: Date}): Promise<EntityDocument> {
    repository.deletedAt = undefined
    return repository.save()
  }

  // bulk
  async createMany<Dto>(data: Dto[], options?: IDatabaseCreateManyOptions<ClientSession>): Promise<boolean> {
    const dataCreate: Record<string, any>[] = data.map((val) => ({
      ...(val as any),
      _id: new Types.ObjectId((val as any)._id),
    }))

    const create = this._repository.insertMany(dataCreate, {
      session: options ? options.session : undefined,
    })

    try {
      await create
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  async deleteManyByIds(_id: string[], options?: IDatabaseManyOptions<ClientSession>): Promise<boolean> {
    const del = this._repository.deleteMany({
      _id: {
        $in: _id.map((val) => new Types.ObjectId(val)),
      },
    })

    if (options?.session) {
      del.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => del.populate(opt))
      }
    }

    try {
      await del
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  async deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions<ClientSession>): Promise<boolean> {
    const del = this._repository.deleteMany(find)

    if (options?.session) {
      del.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => del.populate(opt))
      }
    }

    try {
      await del
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  async softDeleteManyByIds(_id: string[], options?: IDatabaseSoftDeleteManyOptions<ClientSession>): Promise<boolean> {
    const softDel = this._repository
      .updateMany(
        {
          _id: {
            $in: _id.map((val) => new Types.ObjectId(val)),
          },
        },
        {
          $set: {
            deletedAt: new Date(),
          },
        }
      )
      .where(DATABASE_DELETED_AT_FIELD_NAME)
      .exists(false)

    if (options?.session) {
      softDel.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => softDel.populate(opt))
      }
    }

    try {
      await softDel
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  async softDeleteMany(
    find: Record<string, any>,
    options?: IDatabaseSoftDeleteManyOptions<ClientSession>
  ): Promise<boolean> {
    const softDel = this._repository
      .updateMany(find, {
        $set: {
          deletedAt: new Date(),
        },
      })
      .where(DATABASE_DELETED_AT_FIELD_NAME)
      .exists(false)

    if (options?.session) {
      softDel.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => softDel.populate(opt))
      }
    }

    try {
      await softDel
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  async restoreManyByIds(_id: string[], options?: IDatabaseRestoreManyOptions<ClientSession>): Promise<boolean> {
    const rest = this._repository
      .updateMany(
        {
          _id: {
            $in: _id.map((val) => new Types.ObjectId(val)),
          },
        },
        {
          $set: {
            deletedAt: undefined,
          },
        }
      )
      .where(DATABASE_DELETED_AT_FIELD_NAME)
      .exists(true)

    if (options?.session) {
      rest.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => rest.populate(opt))
      }
    }

    try {
      await rest
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  async restoreMany(find: Record<string, any>, options?: IDatabaseRestoreManyOptions<ClientSession>): Promise<boolean> {
    const rest = this._repository
      .updateMany(find, {
        $set: {
          deletedAt: undefined,
        },
      })
      .where(DATABASE_DELETED_AT_FIELD_NAME)
      .exists(true)

    if (options?.session) {
      rest.session(options.session)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => rest.populate(opt))
      }
    }

    try {
      await rest
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  async updateMany<Dto>(
    find: Record<string, any>,
    data: Dto,
    options?: IDatabaseManyOptions<ClientSession>
  ): Promise<boolean> {
    const update = this._repository
      .updateMany(find, {
        $set: data as any,
      })
      .where(DATABASE_DELETED_AT_FIELD_NAME)
      .exists(false)

    if (options?.session) {
      update.session(options.session as ClientSession)
    }

    if (options?.join) {
      const populateOpts = this.getPopulateOptions(options)
      if (populateOpts.length > 0) {
        populateOpts.forEach((opt) => update.populate(opt))
      }
    }

    try {
      await update
      return true
    } catch (err: unknown) {
      throw err
    }
  }

  // raw
  async raw<RawResponse, RawQuery = PipelineStage[]>(
    rawOperation: RawQuery,
    options?: IDatabaseRawOptions
  ): Promise<RawResponse[]> {
    if (!Array.isArray(rawOperation)) {
      throw new Error('Must in array')
    }

    const pipeline: PipelineStage[] = rawOperation

    if (options?.withDeleted) {
      pipeline.push({
        $match: {
          $or: [
            {
              [DATABASE_DELETED_AT_FIELD_NAME]: {
                $exists: false,
              },
            },
            {
              [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: true},
            },
          ],
        },
      })
    } else {
      pipeline.push({
        $match: {
          [DATABASE_DELETED_AT_FIELD_NAME]: {$exists: false},
        },
      })
    }

    const aggregate = this._repository.aggregate<RawResponse>(pipeline)

    if (options?.session) {
      aggregate.session(options?.session)
    }

    return aggregate
  }

  async model(): Promise<Model<Entity>> {
    return this._repository
  }
}

import {Injectable} from '@nestjs/common'
import {Document, Model, Types} from 'mongoose'
import {DatabaseMongoObjectIdRepositoryAbstract} from './mongo/repositories/database.mongo.object-id.repository.abstract'
import {
  IDatabaseCreateManyOptions,
  IDatabaseCreateOptions,
  IDatabaseExistOptions,
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
  IDatabaseManyOptions,
  IDatabaseOptions,
} from '../interfaces/database.interface'

class GenericRepository<Entity, EntityDocument extends Document<Types.ObjectId>> extends DatabaseMongoObjectIdRepositoryAbstract<Entity, EntityDocument> {
  constructor(model: Model<Entity>) {
    super(model)
  }
}

@Injectable()
export abstract class DatabaseGenericServiceAbstract<Entity, EntityDocument extends Document<Types.ObjectId>> {
  protected readonly repository: GenericRepository<Entity, EntityDocument>

  constructor(model: Model<Entity>) {
    this.repository = new GenericRepository(model)
  }

  async findAll<T = EntityDocument>(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<T[]> {
    return this.repository.findAll(find, options)
  }

  async findOne<T = EntityDocument>(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<T> {
    return this.repository.findOne(find, options)
  }

  async findOneById<T = EntityDocument>(id: string, options?: IDatabaseFindOneOptions): Promise<T> {
    return this.repository.findOneById(id, options)
  }

  async getTotal(find?: Record<string, any>, options?: IDatabaseOptions): Promise<number> {
    return this.repository.getTotal(find, options)
  }

  async exists(find: Record<string, any>, options?: IDatabaseExistOptions): Promise<boolean> {
    return this.repository.exists(find, options)
  }

  async create<Dto = any>(data: Dto, options?: IDatabaseCreateOptions): Promise<EntityDocument> {
    return this.repository.create(data, options)
  }

  async save(repository: EntityDocument): Promise<EntityDocument> {
    return this.repository.save(repository)
  }

  async delete(repository: EntityDocument): Promise<EntityDocument> {
    return this.repository.delete(repository)
  }

  async createMany<Dto>(data: Dto[], options?: IDatabaseCreateManyOptions): Promise<boolean> {
    return this.repository.createMany(data, options)
  }

  async deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions): Promise<boolean> {
    return this.repository.deleteMany(find, options)
  }

  async updateMany<Dto>(find: Record<string, any>, data: Dto, options?: IDatabaseManyOptions): Promise<boolean> {
    return this.repository.updateMany(find, data, options)
  }
}
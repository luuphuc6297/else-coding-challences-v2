import {DynamicModule, Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'
import {DATABASE_CONNECTION_NAME} from './constants/database.constant'

interface EntitySchemaDefinition {
  name: string
  schema: any
}

interface RepositoryModuleOptions {
  entities: EntitySchemaDefinition[]
  repositories: any[]
}

@Module({})
export class BaseRepositoryModule {
  static forFeature(options: RepositoryModuleOptions): DynamicModule {
    return {
      module: BaseRepositoryModule,
      imports: [
        MongooseModule.forFeature(
          options.entities.map(entity => ({
            name: entity.name,
            schema: entity.schema,
          })),
          DATABASE_CONNECTION_NAME
        ),
      ],
      providers: [...options.repositories],
      exports: [...options.repositories],
    }
  }
}
import {
    IDatabaseCreateManyOptions,
    IDatabaseCreateOptions,
    IDatabaseExistOptions,
    IDatabaseFindAllOptions,
    IDatabaseFindOneOptions,
    IDatabaseManyOptions,
    IDatabaseOptions,
} from '@infras/database/interfaces/database.interface'
import { RoleCreateDto } from '@infras/role/dtos/role.create.dto'
import { RoleUpdatePermissionDto } from '@infras/role/dtos/role.update-permission.dto'
import { RoleUpdateDto } from '@infras/role/dtos/role.update.dto'
import { RoleDoc, RoleEntity } from '@infras/role/repository/entities/role.entity'

export interface IRoleService {
    findAll(find?: Record<string, any>, options?: IDatabaseFindAllOptions): Promise<RoleEntity[]>
    findOneById(_id: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>
    findOne(find: Record<string, any>, options?: IDatabaseFindOneOptions): Promise<RoleDoc>
    findOneByName(name: string, options?: IDatabaseFindOneOptions): Promise<RoleDoc>
    getTotal(find?: Record<string, any>, options?: IDatabaseOptions): Promise<number>
    existByName(name: string, options?: IDatabaseExistOptions): Promise<boolean>
    create(data: RoleCreateDto, options?: IDatabaseCreateOptions): Promise<RoleDoc>
    update(repository: RoleDoc, data: RoleUpdateDto): Promise<RoleDoc>
    updatePermissions(repository: RoleDoc, data: RoleUpdatePermissionDto): Promise<RoleDoc>
    active(repository: RoleDoc): Promise<RoleDoc>
    inactive(repository: RoleDoc): Promise<RoleDoc>
    delete(repository: RoleDoc): Promise<RoleDoc>
    deleteMany(find: Record<string, any>, options?: IDatabaseManyOptions): Promise<boolean>
    createMany(data: RoleCreateDto[], options?: IDatabaseCreateManyOptions): Promise<boolean>
}

import { IPaginationOptions } from '@infras/pagination/interfaces/pagination.interface'
import { PopulateOptions } from 'mongoose'

export interface IDatabaseFindOneOptions<T = any> extends Pick<IPaginationOptions, 'order'> {
    select?: Record<string, boolean | number>
    join?: boolean | string | PopulateOptions | (string | PopulateOptions)[] | undefined
    session?: T
    withDeleted?: boolean
}

export type IDatabaseOptions<T = any> = Pick<
    IDatabaseFindOneOptions<T>,
    'session' | 'withDeleted' | 'join'
>

export interface IDatabaseFindAllOptions<T = any>
    extends IPaginationOptions,
        Omit<IDatabaseFindOneOptions<T>, 'order'> {}

export interface IDatabaseCreateOptions<T = any>
    extends Pick<IDatabaseFindOneOptions<T>, 'session'> {
    _id?: string
}

// exist
export interface IDatabaseExistOptions<T = any> extends IDatabaseOptions<T> {
    excludeId?: string[]
}

// bulk
export type IDatabaseManyOptions<T = any> = Pick<IDatabaseFindOneOptions<T>, 'session' | 'join'>

export type IDatabaseCreateManyOptions<T = any> = Pick<IDatabaseOptions<T>, 'session'>

export type IDatabaseSoftDeleteManyOptions<T = any> = IDatabaseManyOptions<T>

export type IDatabaseRestoreManyOptions<T = any> = IDatabaseManyOptions<T>

export type IDatabaseRawOptions<T = any> = Pick<IDatabaseOptions<T>, 'session' | 'withDeleted'>

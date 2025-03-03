import { IMessageOptionsProperties } from '@infras/message/interfaces/message.interface'
import { ClassConstructor } from 'class-transformer'

export interface IResponseCustomPropertyMetadata {
    statusCode?: number
    message?: string
    messageProperties?: IMessageOptionsProperties
}

export interface IResponseMetadata {
    customProperty?: IResponseCustomPropertyMetadata
    [key: string]: any
}

export interface IResponseOptions<T> {
    serialization?: ClassConstructor<T>
    messageProperties?: IMessageOptionsProperties
}

export type IResponsePagingOptions<T> = IResponseOptions<T>

export interface IResponse {
    _metadata?: IResponseMetadata
    data: Record<string, any>
}

export interface IResponsePagingPagination {
    totalPage: number
    total: number
}

export interface IResponsePaging {
    _metadata?: IResponseMetadata
    _pagination: IResponsePagingPagination
    data: Record<string, any>[]
}

import { ERROR_TYPE } from '@infras/error/constants/error.enum.constant'
import { IMessage } from '@infras/message/interfaces/message.interface'
import { IResponseCustomPropertyMetadata } from '@infras/response/interfaces/response.interface'
import { ValidationError } from 'class-validator'

export interface IErrors {
    readonly message: string | IMessage
    readonly property: string
}

export type IErrorCustomPropertyMetadata = Pick<
    IResponseCustomPropertyMetadata,
    'messageProperties'
>

export interface IErrorMetadata {
    customProperty?: IErrorCustomPropertyMetadata
    [key: string]: any
}

export interface IErrorException {
    statusCode: number
    message: string
    errors?: ValidationError[]
    data?: Record<string, any>
    _error?: string
    _errorType?: ERROR_TYPE
    _metadata?: IErrorMetadata
}

export interface IErrorHttpFilter extends Omit<IErrorException, '_errorType' | 'message'> {
    message: string | IMessage
}

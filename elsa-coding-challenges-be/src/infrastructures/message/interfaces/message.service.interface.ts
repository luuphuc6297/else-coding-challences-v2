import {IErrors} from '@infras/error/interfaces/error.interface'
import {IMessageErrorOptions, IMessageOptions, IMessageSetOptions} from '@infras/message/interfaces/message.interface'
import {ValidationError} from '@nestjs/common'

export interface IMessageService {
  getAvailableLanguages(): string[]
  getLanguage(): string
  filterLanguage(customLanguages: string[]): string[]
  setMessage(lang: string, key: string, options?: IMessageSetOptions): string
  getRequestErrorsMessage(requestErrors: ValidationError[], options?: IMessageErrorOptions): IErrors[]

  get<T = string>(key: string, options?: IMessageOptions): T
}

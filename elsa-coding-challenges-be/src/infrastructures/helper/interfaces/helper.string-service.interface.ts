import {IHelperStringRandomOptions} from '@infras/helper/interfaces/helper.interface'

export interface IHelperStringService {
  checkEmail(email: string): boolean
  randomReference(length: number, prefix?: string): string
  random(length: number, options?: IHelperStringRandomOptions): string
  censor(value: string): string
  checkPasswordStrong(password: string, length?: number): boolean
  checkSafeString(text: string): boolean
}

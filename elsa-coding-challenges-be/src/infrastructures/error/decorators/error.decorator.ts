import {ERROR_CLASS_META_KEY, ERROR_FUNCTION_META_KEY} from '@infras/error/constants/error.constant'
import {applyDecorators, SetMetadata} from '@nestjs/common'

export function ErrorMeta(cls: string, func: string): MethodDecorator {
  return applyDecorators(SetMetadata(ERROR_CLASS_META_KEY, cls), SetMetadata(ERROR_FUNCTION_META_KEY, func))
}

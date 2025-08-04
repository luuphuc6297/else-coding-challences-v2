import {ENUM_PAGINATION_FILTER_CASE_OPTIONS} from '@infras/pagination/constants/pagination.enum.constant'
import {IPaginationFilterStringEqualOptions} from '@infras/pagination/interfaces/pagination.interface'
import {PaginationService} from '@infras/pagination/services/pagination.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Inject, Injectable, mixin, Type} from '@nestjs/common'
import {ArgumentMetadata, PipeTransform, Scope} from '@nestjs/common/interfaces'
import {REQUEST} from '@nestjs/core'
import {isNumber, toNumber} from 'lodash'

export function PaginationFilterEqualPipe(options?: IPaginationFilterStringEqualOptions): Type<PipeTransform> {
  @Injectable({scope: Scope.REQUEST})
  class MixinPaginationFilterEqualPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService
    ) {}

    async transform(value: string, {data: field}: ArgumentMetadata): Promise<Record<string, string | number>> {
      const fieldName = field?.toString() ?? ''
      if (!value) {
        return {}
      }

      if (options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.UPPERCASE) {
        value = value.toUpperCase()
      } else if (options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.LOWERCASE) {
        value = value.toUpperCase()
      }

      if (options?.trim) {
        value = value.trim()
      }

      let finalValue: string | number = value
      if (options?.isNumber) {
        finalValue = isNumber(value) ? toNumber(value) : value
      }

      this.request.__filters = {
        ...this.request.__filters,
        [fieldName]: finalValue,
      }

      return this.paginationService.filterEqual<string | number>(fieldName, finalValue)
    }
  }

  return mixin(MixinPaginationFilterEqualPipe)
}

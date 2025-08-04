import {ENUM_PAGINATION_FILTER_CASE_OPTIONS} from '@infras/pagination/constants/pagination.enum.constant'
import {IPaginationFilterStringContainOptions} from '@infras/pagination/interfaces/pagination.interface'
import {PaginationService} from '@infras/pagination/services/pagination.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Inject, Injectable, mixin, Type} from '@nestjs/common'
import {ArgumentMetadata, PipeTransform, Scope} from '@nestjs/common/interfaces'
import {REQUEST} from '@nestjs/core'

export function PaginationFilterContainPipe(options?: IPaginationFilterStringContainOptions): Type<PipeTransform> {
  @Injectable({scope: Scope.REQUEST})
  class MixinPaginationFilterContainPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService
    ) {}

    async transform(
      value: string,
      {data: field}: ArgumentMetadata
    ): Promise<Record<string, {$regex: RegExp; $options: string}>> {
      if (!value) {
        value = ''
      }

      if (!field) {
        field = ''
      }

      if (options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.UPPERCASE) {
        value = value.toUpperCase()
      } else if (options?.case === ENUM_PAGINATION_FILTER_CASE_OPTIONS.LOWERCASE) {
        value = value.toUpperCase()
      }

      if (options?.trim) {
        value = value.trim()
      }

      if (options?.fullMatch) {
        return this.paginationService.filterContainFullMatch(field, value)
      }

      this.request.__filters = {
        ...this.request.__filters,
        [field]: value,
      }

      return this.paginationService.filterContain(field, value)
    }
  }

  return mixin(MixinPaginationFilterContainPipe)
}

import {PaginationService} from '@infras/pagination/services/pagination.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Inject, Injectable, mixin, Type} from '@nestjs/common'
import {ArgumentMetadata, PipeTransform, Scope} from '@nestjs/common/interfaces'
import {REQUEST} from '@nestjs/core'

export function PaginationFilterInEnumPipe<T>(defaultValue: T, defaultEnum: Record<string, any>): Type<PipeTransform> {
  @Injectable({scope: Scope.REQUEST})
  class MixinPaginationFilterInEnumPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService
    ) {}

    async transform(value: string, {data: field}: ArgumentMetadata): Promise<Record<string, {$in: T[]}>> {
      const fieldName = field?.toString() ?? ''
      let finalValue: T[] = defaultValue as T[]

      if (value) {
        finalValue = value
          .split(',')
          .map((val: string) => defaultEnum[val])
          .filter((val: string) => val) as T[]
      }

      this.request.__filters = {
        ...this.request.__filters,
        [fieldName]: finalValue as string[],
      }

      return this.paginationService.filterIn<T>(fieldName, finalValue)
    }
  }

  return mixin(MixinPaginationFilterInEnumPipe)
}

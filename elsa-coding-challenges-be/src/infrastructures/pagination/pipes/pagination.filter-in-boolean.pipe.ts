import {PaginationService} from '@infras/pagination/services/pagination.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Inject, Injectable, mixin, Type} from '@nestjs/common'
import {ArgumentMetadata, PipeTransform, Scope} from '@nestjs/common/interfaces'
import {REQUEST} from '@nestjs/core'
import {uniq} from 'lodash'

export function PaginationFilterInBooleanPipe(defaultValue: boolean[]): Type<PipeTransform> {
  @Injectable({scope: Scope.REQUEST})
  class MixinPaginationFilterInBooleanPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService
    ) {}

    async transform(value: string, {data: field}: ArgumentMetadata): Promise<Record<string, {$in: boolean[]}>> {
      const fieldName = field?.toString() ?? ''
      let finalValue: boolean[] = defaultValue as boolean[]

      if (value) {
        finalValue = uniq(value.split(',').map((val: string) => val === 'true'))
      }

      this.request.__filters = {
        ...this.request.__filters,
        [fieldName]: finalValue,
      }

      return this.paginationService.filterIn<boolean>(fieldName, finalValue)
    }
  }

  return mixin(MixinPaginationFilterInBooleanPipe)
}

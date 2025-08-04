import {ENUM_PAGINATION_ORDER_DIRECTION_TYPE} from '@infras/pagination/constants/pagination.enum.constant'
import {PaginationService} from '@infras/pagination/services/pagination.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Inject, Injectable, mixin, Type} from '@nestjs/common'
import {PipeTransform, Scope} from '@nestjs/common/interfaces'
import {REQUEST} from '@nestjs/core'

export function PaginationSearchPipe(availableSearch: string[]): Type<PipeTransform> {
  @Injectable({scope: Scope.REQUEST})
  class MixinPaginationSearchPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService
    ) {}

    async transform(value: Record<string, any>): Promise<Record<string, any>> {
      const searchText = value?.search ?? ''
      const search: Record<string, any> = this.paginationService.search(value?.search, availableSearch) ?? {}

      this.request.__pagination = {
        ...this.request.__pagination,
        search: searchText,
        availableSearch,
        filters: this.request.__pagination?.filters ?? {},
        page: this.request.__pagination?.page ?? 1,
        perPage: this.request.__pagination?.perPage ?? 20,
        orderBy: this.request.__pagination?.orderBy ?? '',
        orderDirection: this.request.__pagination?.orderDirection ?? ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
        availableOrderBy: this.request.__pagination?.availableOrderBy ?? [],
        availableOrderDirection: this.request.__pagination?.availableOrderDirection ?? [],
      }

      return {
        ...value,
        _search: search,
        _availableSearch: availableSearch,
      }
    }
  }

  return mixin(MixinPaginationSearchPipe)
}

import {ENUM_PAGINATION_ORDER_DIRECTION_TYPE} from '@infras/pagination/constants/pagination.enum.constant'
import {PaginationService} from '@infras/pagination/services/pagination.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Inject, Injectable, mixin, Type} from '@nestjs/common'
import {PipeTransform, Scope} from '@nestjs/common/interfaces'
import {REQUEST} from '@nestjs/core'
import {toNumber} from 'lodash'

export function PaginationPagingPipe(defaultPerPage: number): Type<PipeTransform> {
  @Injectable({scope: Scope.REQUEST})
  class MixinPaginationPagingPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: IRequestApp,
      private readonly paginationService: PaginationService
    ) {}

    async transform(value: Record<string, any>): Promise<Record<string, any>> {
      const page: number = this.paginationService.page(toNumber(value?.page ?? 1))
      const perPage: number = this.paginationService.perPage(toNumber(value?.perPage ?? defaultPerPage))
      const offset: number = this.paginationService.offset(page, perPage)

      this.request.__pagination = {
        ...this.request.__pagination,
        page,
        perPage,
        search: this.request.__pagination?.search ?? '',
        filters: this.request.__pagination?.filters ?? {},
        orderBy: this.request.__pagination?.orderBy ?? '',
        orderDirection: this.request.__pagination?.orderDirection ?? ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC,
        availableSearch: this.request.__pagination?.availableSearch ?? [],
        availableOrderBy: this.request.__pagination?.availableOrderBy ?? [],
        availableOrderDirection: this.request.__pagination?.availableOrderDirection ?? [],
      }

      return {
        ...value,
        page,
        perPage,
        _limit: perPage,
        _offset: offset,
      }
    }
  }

  return mixin(MixinPaginationPagingPipe)
}

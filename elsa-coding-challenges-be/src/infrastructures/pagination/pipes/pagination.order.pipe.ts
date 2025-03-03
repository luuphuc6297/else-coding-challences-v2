import { PAGINATION_AVAILABLE_ORDER_DIRECTION } from '@infras/pagination/constants/pagination.constant'
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '@infras/pagination/constants/pagination.enum.constant'
import { PaginationService } from '@infras/pagination/services/pagination.service'
import { IRequestApp } from '@infras/request/interfaces/request.interface'
import { Inject, Injectable, mixin, Type } from '@nestjs/common'
import { PipeTransform, Scope } from '@nestjs/common/interfaces'
import { REQUEST } from '@nestjs/core'

export function PaginationOrderPipe(
    defaultOrderBy: string,
    defaultOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
    availableOrderBy: string[]
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationOrderPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: Record<string, any>): Promise<Record<string, any>> {
            const orderBy: string = value?.orderBy ?? defaultOrderBy
            const orderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE =
                value?.orderDirection ?? defaultOrderDirection
            const availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[] =
                PAGINATION_AVAILABLE_ORDER_DIRECTION

            const order: Record<string, any> = this.paginationService.order(
                orderBy,
                orderDirection,
                availableOrderBy
            )

            this.request.__pagination = {
                ...this.request.__pagination,
                orderBy,
                orderDirection,
                availableOrderBy,
                availableOrderDirection,
                search: this.request.__pagination?.search ?? '',
                filters: this.request.__pagination?.filters ?? {},
                page: this.request.__pagination?.page ?? 1,
                perPage: this.request.__pagination?.perPage ?? 20,
                availableSearch: this.request.__pagination?.availableSearch ?? []
            }

            return {
                ...value,
                _order: order,
                _availableOrderBy: availableOrderBy,
                _availableOrderDirection: availableOrderDirection,
            }
        }
    }

    return mixin(MixinPaginationOrderPipe)
}

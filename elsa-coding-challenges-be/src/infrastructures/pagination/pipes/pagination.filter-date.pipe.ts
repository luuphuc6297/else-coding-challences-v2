import { HelperDateService } from '@infras/helper/services/helper.date.service'
import { ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS } from '@infras/pagination/constants/pagination.enum.constant'
import { IPaginationFilterDateOptions } from '@infras/pagination/interfaces/pagination.interface'
import { PaginationService } from '@infras/pagination/services/pagination.service'
import { IRequestApp } from '@infras/request/interfaces/request.interface'
import { Inject, Injectable, mixin, Type } from '@nestjs/common'
import { ArgumentMetadata, PipeTransform, Scope } from '@nestjs/common/interfaces'
import { REQUEST } from '@nestjs/core'

export function PaginationFilterDatePipe(
    options?: IPaginationFilterDateOptions
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterDatePipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService,
            private readonly helperDateService: HelperDateService
        ) {}

        async transform(
            value: string,
            { data: field }: ArgumentMetadata
        ): Promise<Record<string, Date>> {
            const fieldName = field?.toString() ?? ''
            let date: Date = this.helperDateService.create(value)

            if (options?.time === ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS.END_OF_DAY) {
                date = this.helperDateService.endOfDay(date)
            } else if (options?.time === ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS.START_OF_DAY) {
                date = this.helperDateService.startOfDay(date)
            }

            this.request.__filters = {
                ...this.request.__filters,
                [fieldName]: value,
            }

            return this.paginationService.filterDate(fieldName, date)
        }
    }

    return mixin(MixinPaginationFilterDatePipe)
}

import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '@infras/pagination/constants/pagination.enum.constant'
import { IPaginationOrder } from '@infras/pagination/interfaces/pagination.interface'
import { ApiHideProperty } from '@nestjs/swagger'

export class PaginationListDto {
    @ApiHideProperty()
    _search: Record<string, any>

    @ApiHideProperty()
    _limit: number

    @ApiHideProperty()
    _offset: number

    @ApiHideProperty()
    _order: IPaginationOrder

    @ApiHideProperty()
    _availableOrderBy: string[]

    @ApiHideProperty()
    _availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[]
}

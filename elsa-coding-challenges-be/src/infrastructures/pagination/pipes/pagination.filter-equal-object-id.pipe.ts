import {PaginationService} from '@infras/pagination/services/pagination.service'
import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Inject, Injectable} from '@nestjs/common'
import {ArgumentMetadata, PipeTransform, Scope} from '@nestjs/common/interfaces'
import {REQUEST} from '@nestjs/core'
import {Types} from 'mongoose'

@Injectable({scope: Scope.REQUEST})
export class PaginationFilterEqualObjectIdPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: IRequestApp,
    private readonly paginationService: PaginationService
  ) {}

  async transform(value: string, {data: field}: ArgumentMetadata): Promise<Record<string, Types.ObjectId | string>> {
    const fieldName = field?.toString() ?? ''
    if (!value) {
      return {}
    }

    value = value.trim()
    const finalValue = Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : value

    this.request.__filters = {
      ...this.request.__filters,
      [fieldName]: value,
    }

    return this.paginationService.filterEqual<Types.ObjectId | string>(fieldName, finalValue)
  }
}

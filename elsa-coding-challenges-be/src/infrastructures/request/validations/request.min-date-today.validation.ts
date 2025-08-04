import {HelperDateService} from '@infras/helper/services/helper.date.service'
import {Injectable} from '@nestjs/common'
import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator'

@ValidatorConstraint({async: true})
@Injectable()
export class MinDateTodayConstraint implements ValidatorConstraintInterface {
  constructor(private readonly helperDateService: HelperDateService) {}

  validate(value: string): boolean {
    const todayDate = this.helperDateService.startOfDay()
    const valueDate = this.helperDateService.create(value)
    return valueDate >= todayDate
  }
}

export function MinDateToday(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'MinDateTodayEqual',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: MinDateTodayConstraint,
    })
  }
}

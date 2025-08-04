import {ENUM_HELPER_DATE_DIFF, ENUM_HELPER_DATE_FORMAT} from '@infras/helper/constants/helper.enum.constant'

export interface IHelperJwtVerifyOptions {
  audience: string
  issuer: string
  subject: string
  secretKey: string
}

export interface IHelperJwtOptions extends IHelperJwtVerifyOptions {
  expiredIn: number | string
  notBefore?: number | string
}

// Helper String
export interface IHelperStringRandomOptions {
  upperCase?: boolean
  safe?: boolean
  prefix?: string
}

// Helper Date
export interface IHelperDateStartAndEnd {
  month?: number
  year?: number
}

export interface IHelperDateStartAndEndDate {
  startDate: Date
  endDate: Date
}

export interface IHelperDateExtractDate {
  date: Date
  day: string
  month: string
  year: string
}

export interface IHelperDateOptionsDiff {
  format?: ENUM_HELPER_DATE_DIFF
}

export interface IHelperDateOptionsCreate {
  startOfDay?: boolean
}

export interface IHelperDateOptionsFormat {
  format?: ENUM_HELPER_DATE_FORMAT | string
}

export interface IHelperDateOptionsForward {
  fromDate?: Date
}

export type IHelperDateOptionsBackward = IHelperDateOptionsForward

export interface IHelperDateOptionsRoundDown {
  hour: boolean
  minute: boolean
  second: boolean
}

export interface IHelperJwtVerifyOptions {
  audience: string
  issuer: string
  subject: string
  secretKey: string
}

export interface IHelperJwtOptions extends IHelperJwtVerifyOptions {
  expiredIn: number | string
  notBefore?: number | string
}

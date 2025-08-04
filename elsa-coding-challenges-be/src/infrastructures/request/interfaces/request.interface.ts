import {RequestPaginationSerialization} from '@infras/request/serializations/request.pagination.serialization'
import {Request} from 'express'
import {IResult} from 'ua-parser-js'

export interface IRequestApp extends Request {
  __id: string
  __xTimestamp?: number
  __timestamp: number
  __timezone: string
  __customLang: string[]
  __xCustomLang: string
  __version: string
  __repoVersion: string
  __class?: string
  __function?: string
  __pagination?: RequestPaginationSerialization
  __userAgent: IResult
  __filters?: Record<string, any>
  path: string
  query: Record<string, any>
  originalUrl: string
  headers: Record<string, any>
  apiKey?: any
  method: string
  user?: any
  body?: Record<string, any>
  params?: Record<string, any>
}

import { LoggerCreateDto, LoggerCreateRawDto } from '@infras/logger/dtos/logger.create.dto'
import { LoggerDoc } from '@infras/logger/repository/entities/logger.entity'

export interface ILoggerService {
    info({
        action,
        description,
        apiKey,
        user,
        method,
        requestId,
        role,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDto): Promise<LoggerDoc>
    debug({
        action,
        description,
        apiKey,
        user,
        method,
        requestId,
        role,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDto): Promise<LoggerDoc>
    warn({
        action,
        description,
        apiKey,
        user,
        method,
        requestId,
        role,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDto): Promise<LoggerDoc>
    fatal({
        action,
        description,
        apiKey,
        user,
        method,
        requestId,
        role,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDto): Promise<LoggerDoc>
    raw({
        level,
        action,
        description,
        apiKey,
        user,
        method,
        requestId,
        role,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateRawDto): Promise<LoggerDoc>
}

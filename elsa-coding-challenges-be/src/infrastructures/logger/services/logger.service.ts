import { ENUM_LOGGER_LEVEL } from '@infras/logger/constants/logger.enum.constant'
import { LoggerCreateDto, LoggerCreateRawDto } from '@infras/logger/dtos/logger.create.dto'
import { ILoggerService } from '@infras/logger/interfaces/logger.service.interface'
import { LoggerDoc, LoggerEntity } from '@infras/logger/repository/entities/logger.entity'
import { LoggerRepository } from '@infras/logger/repository/repositories/logger.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LoggerService implements ILoggerService {
    constructor(private readonly loggerRepository: LoggerRepository) {}

    async info({
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
    }: LoggerCreateDto): Promise<LoggerDoc> {
        const create: LoggerEntity = new LoggerEntity()
        create.level = ENUM_LOGGER_LEVEL.INFO
        create.user = user
        create.apiKey = apiKey
        create.anonymous = !user
        create.action = action
        create.description = description
        create.method = method
        create.requestId = requestId
        create.role = role
        create.params = params
        create.bodies = bodies
        create.path = path
        create.statusCode = statusCode
        create.tags = tags ?? []

        return this.loggerRepository.create<LoggerEntity>(create)
    }

    async debug({
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
    }: LoggerCreateDto): Promise<LoggerDoc> {
        const create: LoggerEntity = new LoggerEntity()
        create.level = ENUM_LOGGER_LEVEL.DEBUG
        create.user = user
        create.apiKey = apiKey
        create.anonymous = !user
        create.action = action
        create.description = description
        create.method = method
        create.requestId = requestId
        create.role = role
        create.params = params
        create.bodies = bodies
        create.path = path
        create.statusCode = statusCode
        create.tags = tags ?? []

        return this.loggerRepository.create<LoggerEntity>(create)
    }

    async warn({
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
    }: LoggerCreateDto): Promise<LoggerDoc> {
        const create: LoggerEntity = new LoggerEntity()
        create.level = ENUM_LOGGER_LEVEL.WARN
        create.user = user
        create.apiKey = apiKey
        create.anonymous = !user
        create.action = action
        create.description = description
        create.method = method
        create.requestId = requestId
        create.role = role
        create.params = params
        create.bodies = bodies
        create.path = path
        create.statusCode = statusCode
        create.tags = tags ?? []

        return this.loggerRepository.create<LoggerEntity>(create)
    }

    async fatal({
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
    }: LoggerCreateDto): Promise<LoggerDoc> {
        const create: LoggerEntity = new LoggerEntity()
        create.level = ENUM_LOGGER_LEVEL.FATAL
        create.user = user
        create.apiKey = apiKey
        create.anonymous = !user
        create.action = action
        create.description = description
        create.method = method
        create.requestId = requestId
        create.role = role
        create.params = params
        create.bodies = bodies
        create.path = path
        create.statusCode = statusCode
        create.tags = tags ?? []

        return this.loggerRepository.create<LoggerEntity>(create)
    }

    async raw({
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
    }: LoggerCreateRawDto): Promise<LoggerDoc> {
        const create: LoggerEntity = new LoggerEntity()
        create.level = level
        create.user = user
        create.apiKey = apiKey
        create.anonymous = !user
        create.action = action
        create.description = description
        create.method = method
        create.requestId = requestId
        create.role = role
        create.params = params
        create.bodies = bodies
        create.path = path
        create.statusCode = statusCode
        create.tags = tags ?? []

        return this.loggerRepository.create<LoggerEntity>(create)
    }
}

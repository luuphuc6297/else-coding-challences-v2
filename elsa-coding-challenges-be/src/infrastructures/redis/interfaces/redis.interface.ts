import { Redis } from 'ioredis'

export interface IRedisOptions {
    url?: string
    host?: string
    port?: number
    password?: string
    db?: number
    keyPrefix?: string
    retryAttempts?: number
    retryDelay?: number
    enableReadyCheck?: boolean
}

export interface IRedisOptionsFactory {
    createRedisOptions(): Promise<IRedisOptions> | IRedisOptions
}

export interface IRedisModuleOptions {
    isGlobal?: boolean
    connectionName?: string
    defaultOptions?: IRedisOptions
    useFactory?: (...args: any[]) => Promise<IRedisOptions> | IRedisOptions
    inject?: any[]
}

export interface IRedisSubscribeOptions {
    channel: string
    handler: (channel: string, message: string) => void | Promise<void>
}

export type IRedisClient = Redis

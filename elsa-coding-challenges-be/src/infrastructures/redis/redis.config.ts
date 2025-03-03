import { registerAs } from '@nestjs/config'
import * as Joi from 'joi'
import { REDIS_DEFAULT_DB, REDIS_DEFAULT_HOST, REDIS_DEFAULT_PORT } from './constants/redis.constant'

export const redisConfigValidationSchema = Joi.object({
    REDIS_HOST: Joi.string().default(REDIS_DEFAULT_HOST),
    REDIS_PORT: Joi.number().default(REDIS_DEFAULT_PORT),
    REDIS_PASSWORD: Joi.string().allow('').default(''),
    REDIS_DB: Joi.number().default(REDIS_DEFAULT_DB),
})

export const redisConfig = registerAs('redis', () => {
    const config = {
        url: process.env.REDIS_URL || null,
        host: process.env.REDIS_HOST || REDIS_DEFAULT_HOST,
        port: parseInt(process.env.REDIS_PORT || String(REDIS_DEFAULT_PORT), 10),
        password: process.env.REDIS_PASSWORD || '',
        db: parseInt(process.env.REDIS_DB || String(REDIS_DEFAULT_DB), 10),
        keyPrefix: 'elsa:',
        retryAttempts: 10,
        retryDelay: 3000,
        enableReadyCheck: true,
    }

    return config
}) 
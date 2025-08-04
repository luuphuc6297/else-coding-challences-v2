import {registerAs} from '@nestjs/config'
import {REDIS_DEFAULT_DB, REDIS_DEFAULT_HOST, REDIS_DEFAULT_PORT} from '@infras/redis/constants/redis.constant'

export default registerAs(
  'redis',
  (): Record<string, any> => ({
    url: process.env.REDIS_URL || `redis://${REDIS_DEFAULT_HOST}:${REDIS_DEFAULT_PORT}`,
    host: process.env.REDIS_HOST || REDIS_DEFAULT_HOST,
    port: parseInt(process.env.REDIS_PORT || String(REDIS_DEFAULT_PORT)),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || String(REDIS_DEFAULT_DB)),
    keyPrefix: process.env.REDIS_KEY_PREFIX || '',
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS || '10'),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '3000'),
    enableReadyCheck: process.env.REDIS_ENABLE_READY_CHECK === 'true',
  })
)

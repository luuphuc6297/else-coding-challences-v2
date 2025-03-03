export const REDIS_CONNECTION_NAME = 'RedisConnection'
export const REDIS_SUBSCRIBER_CLIENT = 'RedisSubscriberClient'
export const REDIS_PUBLISHER_CLIENT = 'RedisPublisherClient'

export const REDIS_DEFAULT_DB = 0
export const REDIS_DEFAULT_PORT = 6379
export const REDIS_DEFAULT_HOST = 'localhost'
export const REDIS_DEFAULT_PASSWORD = ''
export const REDIS_DEFAULT_PREFIX = 'elsa:'

export const REDIS_CONNECTION = {
    DEFAULT: 'default',
    PUBSUB: 'pubsub',
}

export const REDIS_EVENTS = {
    CONNECT: 'connect',
    READY: 'ready',
    ERROR: 'error',
    CLOSE: 'close',
    RECONNECTING: 'reconnecting',
    END: 'end',
}

export const REDIS_PUBSUB_EVENTS = {
    MESSAGE: 'message',
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    ERROR: 'error',
}

import {Injectable, Logger, OnModuleDestroy, OnModuleInit} from '@nestjs/common'
import {InjectRedis} from '@nestjs-modules/ioredis'
import {Redis} from 'ioredis'
import {REDIS_CONNECTION, REDIS_PUBSUB_EVENTS} from '../constants/redis.constant'
import {IRedisSubscribeOptions} from '../interfaces/redis.interface'

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisPubSubService.name)
  private readonly subscribers: Map<string, Set<(channel: string, message: string) => void>> = new Map()
  private readonly subscriber: Redis
  private readonly publisher: Redis

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.subscriber = redis.duplicate()
    this.publisher = redis.duplicate()

    this.subscriber.on(REDIS_PUBSUB_EVENTS.MESSAGE, this.handleMessage.bind(this))
    this.subscriber.on(REDIS_PUBSUB_EVENTS.ERROR, (error) => {
      this.logger.error(`Subscriber error: ${error.message}`)
    })
    this.publisher.on(REDIS_PUBSUB_EVENTS.ERROR, (error) => {
      this.logger.error(`Publisher error: ${error.message}`)
    })
  }

  async onModuleInit() {
    try {
      await Promise.all([
        this.subscriber.client('SETNAME', `${REDIS_CONNECTION.PUBSUB}:subscriber`),
        this.publisher.client('SETNAME', `${REDIS_CONNECTION.PUBSUB}:publisher`),
      ])
      this.logger.log('Redis PubSub service initialized')
    } catch (error) {
      this.logger.error(`Failed to initialize Redis PubSub service: ${error.message}`)
      throw error
    }
  }

  async onModuleDestroy() {
    try {
      await Promise.all([this.subscriber.quit(), this.publisher.quit()])
      this.logger.log('Redis PubSub service destroyed')
    } catch (error) {
      this.logger.error(`Failed to destroy Redis PubSub service: ${error.message}`)
    }
  }

  async publish(channel: string, message: string): Promise<void> {
    try {
      await this.publisher.publish(channel, message)
      this.logger.debug(`Published message to channel ${channel}`)
    } catch (error) {
      this.logger.error(`Failed to publish message to channel ${channel}: ${error.message}`)
      throw error
    }
  }

  async subscribe(options: IRedisSubscribeOptions): Promise<void> {
    const {channel, handler} = options

    try {
      if (!this.subscribers.has(channel)) {
        this.subscribers.set(channel, new Set())
        await this.subscriber.subscribe(channel)
        this.logger.debug(`Subscribed to channel ${channel}`)
      }

      const handlers = this.subscribers.get(channel)
      if (handlers) {
        handlers.add(handler)
        this.logger.debug(`Added handler for channel ${channel}`)
      }
    } catch (error) {
      this.logger.error(`Failed to subscribe to channel ${channel}: ${error.message}`)
      throw error
    }
  }

  async unsubscribe(channel: string, handler?: (channel: string, message: string) => void): Promise<void> {
    try {
      const handlers = this.subscribers.get(channel)
      if (!handlers) {
        return
      }

      if (handler) {
        handlers.delete(handler)
        this.logger.debug(`Removed handler for channel ${channel}`)

        if (handlers.size === 0) {
          await this.subscriber.unsubscribe(channel)
          this.subscribers.delete(channel)
          this.logger.debug(`Unsubscribed from channel ${channel}`)
        }
      } else {
        await this.subscriber.unsubscribe(channel)
        this.subscribers.delete(channel)
        this.logger.debug(`Unsubscribed from channel ${channel}`)
      }
    } catch (error) {
      this.logger.error(`Failed to unsubscribe from channel ${channel}: ${error.message}`)
      throw error
    }
  }

  private handleMessage(channel: string, message: string): void {
    try {
      const handlers = this.subscribers.get(channel)
      if (!handlers) {
        return
      }

      for (const handler of handlers) {
        try {
          handler(channel, message)
        } catch (error) {
          this.logger.error(`Handler error for channel ${channel}: ${error.message}`)
        }
      }
    } catch (error) {
      this.logger.error(`Failed to handle message from channel ${channel}: ${error.message}`)
    }
  }
}

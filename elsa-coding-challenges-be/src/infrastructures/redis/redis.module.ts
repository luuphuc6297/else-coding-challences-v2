import {DynamicModule, Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {RedisModule as NestRedisModule} from '@nestjs-modules/ioredis'
import {RedisService} from './services/redis.service'
import {RedisPubSubService} from './services/redis.pub-sub.service'
import {REDIS_CONNECTION} from './constants/redis.constant'

@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        NestRedisModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            type: 'single',
            url: configService.get('redis.url'),
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
            password: configService.get('redis.password'),
            db: configService.get('redis.db'),
            keyPrefix: configService.get('redis.keyPrefix'),
            retryAttempts: configService.get('redis.retryAttempts'),
            retryDelay: configService.get('redis.retryDelay'),
            enableReadyCheck: configService.get('redis.enableReadyCheck'),
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [RedisService, RedisPubSubService],
      exports: [RedisService, RedisPubSubService],
      global: true,
    }
  }

  static forFeature(connectionName: string = REDIS_CONNECTION.DEFAULT): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        NestRedisModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            type: 'single',
            url: configService.get('redis.url'),
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
            password: configService.get('redis.password'),
            db: configService.get('redis.db'),
            keyPrefix: configService.get('redis.keyPrefix'),
            retryAttempts: configService.get('redis.retryAttempts'),
            retryDelay: configService.get('redis.retryDelay'),
            enableReadyCheck: configService.get('redis.enableReadyCheck'),
            connectionName,
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [NestRedisModule],
    }
  }
}

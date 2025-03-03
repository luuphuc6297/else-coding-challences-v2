import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private readonly logger = new Logger(RedisService.name);

    constructor(
        @InjectRedis() private readonly redis: Redis
    ) {}

    async get(key: string): Promise<string | null> {
        try {
            const value = await this.redis.get(key);
            this.logger.debug(`Retrieved value for key: ${key}`);
            return value;
        } catch (error) {
            this.logger.error(`Error getting key ${key}: ${error.message}`);
            throw error;
        }
    }

    async set(key: string, value: string, ttl?: number): Promise<void> {
        try {
            if (ttl) {
                await this.redis.set(key, value, 'EX', ttl);
                this.logger.debug(`Set value for key ${key} with TTL ${ttl}s`);
            } else {
                await this.redis.set(key, value);
                this.logger.debug(`Set value for key ${key}`);
            }
        } catch (error) {
            this.logger.error(`Error setting key ${key}: ${error.message}`);
            throw error;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.redis.del(key);
            this.logger.debug(`Deleted key: ${key}`);
        } catch (error) {
            this.logger.error(`Error deleting key ${key}: ${error.message}`);
            throw error;
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.redis.exists(key);
            this.logger.debug(`Checked existence of key: ${key}`);
            return result === 1;
        } catch (error) {
            this.logger.error(`Error checking existence of key ${key}: ${error.message}`);
            throw error;
        }
    }

    getClient(): Redis {
        return this.redis;
    }
} 
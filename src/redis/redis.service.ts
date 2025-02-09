import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  /**
   * Add member to hash set.
   */
  public async addOneToSet(hash: string, value: string): Promise<number> {
    return this.redisClient.sadd(hash, value);
  }

  /**
   * Remove one member from hash set.
   */
  public async remOneFromSet(key: string, setMember: string): Promise<number> {
    return this.redisClient.srem(key, setMember);
  }

  /**
   * Delete all records by key from Redis.
   */
  public async deleteByKey(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  /**
   * Get all the members in a set.
   */
  public async sMembers(key: string): Promise<string[]> {
    return this.redisClient.smembers(key);
  }

  /**
   * Sets a timeout on a key.
   * After the timeout, the key will be automatically deleted.
   */
  public async expire(key: string, time: number): Promise<number> {
    return this.redisClient.expire(key, time);
  }

  /**
   * Getting all keys by pattern
   * */
  public async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }
}

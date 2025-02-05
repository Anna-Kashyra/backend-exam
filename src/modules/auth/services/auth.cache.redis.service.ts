import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { Config, JWTConfig, RedisConfig } from '../../../config/configs.type';
import { RedisService } from '../../../redis/redis.service';

@Injectable()
export class AuthCacheRedisService {
  private jwtConfig: JWTConfig;
  private redisConfig: RedisConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>,
  ) {
    this.jwtConfig = this.configService.get('jwt');
    this.redisConfig = this.configService.get('redis');
  }

  public async saveToken(
    token: string,
    userId: string,
    deviceId: string,
  ): Promise<void> {
    const key = this.getKey(userId, deviceId);

    await this.redisService.deleteByKey(key);
    await this.redisService.addOneToSet(key, token);
    await this.redisService.expire(key, this.jwtConfig.accessExpiresIn);
  }

  async isTokenExist(
    userId: string,
    deviceId: string,
    token: string,
  ): Promise<boolean> {
    const key = this.getKey(userId, deviceId);
    const set = await this.redisService.sMembers(key);
    return set.includes(token);
  }

  public async deleteToken(userId: string, deviceId: string): Promise<void> {
    const key = this.getKey(userId, deviceId);
    await this.redisService.deleteByKey(key);
  }

  private getKey(userId: string, deviceId: string): string {
    return `${this.redisConfig.prefix}:${userId}:${deviceId}`;
  }
}

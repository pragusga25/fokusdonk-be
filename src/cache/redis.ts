import { RedisClient } from 'bun';
import { config } from '../config';
import { AppCache } from '.';

export class RedisSingleton implements AppCache {
  private static instance: RedisSingleton;
  private client: RedisClient | null = null;

  private constructor(redisUrl?: string) {
    if (redisUrl) {
      this.client = new RedisClient(redisUrl);
    }
  }

  public static getInstance(): RedisSingleton {
    if (!RedisSingleton.instance) {
      console.log('Creating Redis singleton instance...');
      RedisSingleton.instance = new RedisSingleton(config.REDIS_URL);
    }
    return RedisSingleton.instance;
  }

  public async get(key: string): Promise<string | null> {
    try {
      if (!this.client) return null;

      const ret = await this.client.get(key);
      return ret;
    } catch {
      return null;
    }
  }

  public async setEx(
    key: RedisClient.KeyLike,
    value: RedisClient.KeyLike,
    seconds: number
  ): Promise<boolean> {
    try {
      if (!this.client) return false;
      return (await this.client.set(key, value, 'EX', seconds)) === 'OK';
    } catch {
      return false;
    }
  }

  public async del(...keys: string[]): Promise<number> {
    try {
      if (!this.client) return 0;
      return this.client.del(...keys);
    } catch {
      return 0;
    }
  }
}

import { RedisSingleton } from './redis';

export interface AppCache {
  get(key: string): Promise<string | null>;
  setEx(key: string, value: string, seconds: number): Promise<boolean>;
  del(...keys: string[]): Promise<number>;
}

export const cache: AppCache = RedisSingleton.getInstance();

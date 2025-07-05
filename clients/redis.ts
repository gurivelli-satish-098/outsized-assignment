import Redis from "ioredis";

let redisInstance: Redis | null = null;

/**
 * Singleton for managing Redis client connection.
 */
export class RedisClient {
  /**
   * Get the singleton Redis client instance.
   * @returns {Redis} The Redis client instance.
   */
  static getInstance(): Redis {
    if (!redisInstance) {
      redisInstance = new Redis(
        process.env.REDIS_URL || "redis://localhost:6379"
      );
    }
    return redisInstance;
  }
}

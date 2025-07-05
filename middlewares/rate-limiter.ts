import { RedisClient } from "../clients/redis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { ValidationError } from "../utils/error";

const redis = RedisClient.getInstance();

// Configurable rate limit
const WINDOW_SIZE_IN_MINUTES = 15;
const MAX_WINDOW_REQUEST_COUNT = 100;
const WINDOW_LOG_INTERVAL_IN_SECONDS = WINDOW_SIZE_IN_MINUTES * 60;

const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: "rateLimit",
  points: MAX_WINDOW_REQUEST_COUNT,
  duration: 60,
  blockDuration: WINDOW_LOG_INTERVAL_IN_SECONDS,
});

/**
 * Middleware to enforce rate limiting based on IP address.
 * @param {any} event - Lambda event object.
 * @returns {Promise<void>} Throws if rate limit exceeded or IP is blocked.
 */
export const rateLimiterMiddleware = async (event: any): Promise<void> => {
  if (!redis) return;
  const ip =
    event.requestContext?.identity?.sourceIp ||
    event.headers["x-forwarded-for"] ||
    event.headers["X-Forwarded-For"] ||
    "unknown";

  // Whitelist check
  const isWhitelisted = await redis.sismember("whitelist:ip", ip);
  if (isWhitelisted) {
    return; // Allow request, skip rate limiting
  }

  // Blocklist check
  const isBlocked = await redis.sismember("blocklist:ip", ip);
  if (isBlocked) {
    throw new ValidationError("Your IP is blocked");
  }

  // Rate limit check
  try {
    await rateLimiter.consume(ip);
  } catch (err: any) {
    if (err && err.msBeforeNext) {
      throw new ValidationError("Too Many Requests");
    } else {
      // Redis or other error, allow request (fail open)
      console.error("Rate limiter error:", err);
      return;
    }
  }
};

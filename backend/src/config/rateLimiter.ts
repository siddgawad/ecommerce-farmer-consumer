import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis, { type RedisOptions } from "ioredis";
import env from "./env.js";

const redisClient = new Redis.default(env.REDIS_URL); // supports redis:// and rediss://

export const limiterGeneral = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rlf-general",
  points: 300,     // 300 requests
  duration: 60,    // per 60 seconds
});

export const limiterAuth = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rlf-auth",
  points: 20,      // 20 requests
  duration: 60,    // per 60 seconds
  blockDuration: 60,
});

export function rateLimitMiddleware(limiter: RateLimiterRedis) {
  return async (req: any, res: any, next: any) => {
    try {
      await limiter.consume(req.ip);
      next();
    } catch {
      res.status(429).json({ success: false, message: "Too many requests", data: null });
    }
  };
}
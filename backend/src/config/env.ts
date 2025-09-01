import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),

  MONGO_URI: z.string().min(1),
  REDIS_URL: z.string().default("redis://localhost:6379"),

  JWT_SECRET: z.string().min(10),
  COOKIE_NAME: z.string().default("auth_token"),
  COOKIE_DOMAIN: z.string().default("localhost"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  // Payments (optional in dev)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
});

const env = EnvSchema.parse(process.env);
export default env;

// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const Urlish = z
  .string()
  .min(1)
  .transform((s) => s.trim());

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(4000),

    // Allow standard Mongo formats (not strictly a URL)
    MONGO_URI: Urlish, // e.g. mongodb+srv://... OR mongodb://...

    // Redis can be redis:// or rediss:// (TLS)
    REDIS_URL: Urlish.default("redis://localhost:6379"),

    JWT_SECRET: z.string().min(10),
    COOKIE_NAME: z.string().default("auth_token"),

    // Leave empty by default so cookies work on localhost without domain pinning
    COOKIE_DOMAIN: z.string().default(""),

    // Frontend origin for CORS (single value). If you need multiple, make this CSV and split in your CORS setup.
    CORS_ORIGIN: Urlish.default("http://localhost:3000"),

    // ✅ Added: used for Stripe success/cancel redirects, and anywhere you need your public app URL
    APP_URL: Urlish.default("http://localhost:3000").transform((s) => s.replace(/\/+$/, "")),

    // Optional in dev; in production you should provide both
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // In production, enforce https for public app URL (Stripe requires https on live)
    if (val.NODE_ENV === "production" && !val.APP_URL.startsWith("https://")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["APP_URL"],
        message: "APP_URL must use https in production.",
      });
    }
    // If one Stripe key is set, strongly encourage the other
    const hasStripe = !!val.STRIPE_SECRET_KEY || !!val.STRIPE_WEBHOOK_SECRET;
    if (val.NODE_ENV === "production" && hasStripe) {
      if (!val.STRIPE_SECRET_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["STRIPE_SECRET_KEY"],
          message: "STRIPE_SECRET_KEY is required in production when using Stripe.",
        });
      }
      if (!val.STRIPE_WEBHOOK_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["STRIPE_WEBHOOK_SECRET"],
          message: "STRIPE_WEBHOOK_SECRET is required in production when using Stripe webhooks.",
        });
      }
    }
  });

const parsed = EnvSchema.parse(process.env);

const env = {
  ...parsed,
  IS_PROD: parsed.NODE_ENV === "production",
  IS_DEV: parsed.NODE_ENV === "development",
  IS_TEST: parsed.NODE_ENV === "test",
} as const;

export default env;
export type Env = typeof env;

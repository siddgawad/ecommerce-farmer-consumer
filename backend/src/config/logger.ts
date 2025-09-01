import winston from "winston";
import morgan from "morgan";
import type { Request } from "express";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `[${timestamp}] ${level}: ${message}${rest}`;
        })
      ),
    }),
  ],
});

// Stream for morgan → winston
const morganStream = {
  write: (message: string) =>
    // @ts-ignore winston@^3.13 doesn't define .http by default; fallback to .info
    (logger.http ? logger.http(message.trim()) : logger.info(message.trim())),
};

// Custom token for user id (if auth middleware sets req.user)
morgan.token("user", (req: Request) => (req as any).user?.id || "anon");

export { logger, morganStream };

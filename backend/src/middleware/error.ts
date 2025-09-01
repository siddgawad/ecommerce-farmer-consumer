import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError.js";
import { logger } from "../config/logger.js";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const message = err?.message || "Internal Server Error";
  logger.error(message, { stack: err?.stack, details: err?.details });
  res.status(status).json({ success: false, message, data: null });
}

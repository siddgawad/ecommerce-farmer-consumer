import type { Request, Response, NextFunction } from "express";

/**
 * Wrap async route handlers to forward errors to Express error middleware.
 */
export function asyncHandler<
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown
>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}

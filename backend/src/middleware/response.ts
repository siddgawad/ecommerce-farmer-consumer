import type { Request, Response, NextFunction } from "express";

export function setStdHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Backend", "ecommerce-farmer-consumer");
  next();
}

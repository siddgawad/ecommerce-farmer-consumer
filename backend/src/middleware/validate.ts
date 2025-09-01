import type { AnyZodObject } from "zod";
import { ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid input",
          data: err.flatten(),
        });
      }
      next(err);
    }
  };
}

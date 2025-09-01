import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export interface JwtPayload {
  id: string;
  role: "user" | "farmer" | "admin";
}

export function auth(required = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : undefined;
    const token = req.cookies?.[env.COOKIE_NAME] || bearer;

    if (!token) {
      if (!required) return next();
      return res.status(401).json({ success: false, message: "Unauthorized", data: null });
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      (req as any).user = decoded;
      next();
    } catch {
      return res.status(401).json({ success: false, message: "Invalid or expired token", data: null });
    }
  };
}

export function requireRoles(...roles: Array<"user" | "farmer" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ success: false, message: "Forbidden", data: null });
    }
    next();
  };
}

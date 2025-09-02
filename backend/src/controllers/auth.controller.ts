import { z } from "zod";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Farmer from "../models/Farmer.js";

/* Schemas */
export const ZUserSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
export const ZUserSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const ZFarmerSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
export const ZFarmerSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/* Helpers */
type Role = "user" | "farmer" | "admin";
function signToken(id: string, role: Role) {
  return jwt.sign({ id, role }, env.JWT_SECRET as string, { expiresIn: "7d" });
}
function setAuthCookie(res: Response, token: string) {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/* Users */
export const userSignup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = ZUserSignupSchema.parse(req.body);
  const emailNorm = email.trim().toLowerCase();

  const exists = await User.findOne({ email: emailNorm });
  if (exists) throw new ApiError(409, "Email already in use");

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: emailNorm,
    password: hash,
    role: "user",
  });

  const token = signToken(user.id, "user");
  setAuthCookie(res, token);
  res.status(201).json(new ApiResponse(true, "Signup successful", { id: user.id, email: user.email, role: user.role, token }));
});

export const userSignin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = ZUserSigninSchema.parse(req.body);
  const emailNorm = email.trim().toLowerCase();

  const user = await User.findOne({ email: emailNorm }).select("+password");
  if (!user) throw new ApiError(401, "Invalid credentials");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signToken(user.id, "user");
  setAuthCookie(res, token);
  res.status(200).json(new ApiResponse(true, "Signin successful", { id: user.id, email: user.email, role: user.role, token }));
});

export const userSignout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/",
  });
  res.status(200).json(new ApiResponse(true, "Signed out", null));
});

/* Farmers */
export const farmerSignup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = ZFarmerSignupSchema.parse(req.body);
  const emailNorm = email.trim().toLowerCase();

  const exists = await Farmer.findOne({ email: emailNorm });
  if (exists) throw new ApiError(409, "Email already in use");

  const hash = await bcrypt.hash(password, 10);
  const farmer = await Farmer.create({
    name: name.trim(),
    email: emailNorm,
    password: hash,
    role: "farmer",
  });

  const token = signToken(farmer.id, "farmer");
  setAuthCookie(res, token);
  res.status(201).json(new ApiResponse(true, "Farmer signup successful", { id: farmer.id, email: farmer.email, role: farmer.role, token }));
});

export const farmerSignin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = ZFarmerSigninSchema.parse(req.body);
  const emailNorm = email.trim().toLowerCase();

  const farmer = await Farmer.findOne({ email: emailNorm }).select("+password");
  if (!farmer) throw new ApiError(401, "Invalid credentials");
  const ok = await bcrypt.compare(password, farmer.password);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signToken(farmer.id, "farmer");
  setAuthCookie(res, token);
  res.status(200).json(new ApiResponse(true, "Farmer signin successful", { id: farmer.id, email: farmer.email, role: farmer.role, token }));
});

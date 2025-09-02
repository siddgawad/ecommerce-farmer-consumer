import { z } from "zod";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import Product from "../models/Product.js";

const ZListQuery = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  status: z.enum(["active","inactive","out_of_stock"]).default("active"),
});

export const listPublicProducts = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status } = ZListQuery.parse(req.query);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find({ status }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments({ status }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  res.json(new ApiResponse(true, "OK", {
    items, page, limit, total, totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  }));
});

export const getPublicProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const product = await Product.findById(productId).lean();
  if (!product) return res.status(404).json(new ApiResponse(false, "Product not found", null));
  res.json(new ApiResponse(true, "OK", product));
});

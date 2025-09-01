import { z } from "zod";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Farmer from "../models/Farmer.js";

/** Zod Schemas */
export const ZProductCreateSchema = z.object({
  name: z.string().min(1),
  image: z.string().url().optional(),
  quantity: z.number().int().nonnegative().default(0),
  status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
  description: z.string().max(1000).optional(),
});

export const ZProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().url().optional(),
  quantity: z.number().int().nonnegative().optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
  description: z.string().max(1000).optional(),
});

/** Dashboard: simple aggregates */
export const farmerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;

  const [productCount, products, ordersCount] = await Promise.all([
    Product.countDocuments({ farmer: farmerId }),
    Product.find({ farmer: farmerId }).select("_id"),
    Order.countDocuments({ "items.product": { $in: (await Product.find({ farmer: farmerId }).select("_id")).map(p => p._id) } }),
  ]);

  res.json(new ApiResponse(true, "OK", {
    productCount,
    ordersCount,
  }));
});

/** Add product */
export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;
  const body = ZProductCreateSchema.parse(req.body);

  const product = await Product.create({ ...body, farmer: farmerId });

  // Link to farmer doc
  await Farmer.updateOne({ _id: farmerId }, { $addToSet: { products: product._id } });

  res.status(201).json(new ApiResponse(true, "Product created", product));
});

/** Edit product (partial) */
export const editProduct = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;
  const { productId } = req.params;
  const body = ZProductUpdateSchema.parse(req.body);

  const product = await Product.findOneAndUpdate(
    { _id: productId, farmer: farmerId },
    { $set: body },
    { new: true }
  );

  if (!product) throw new ApiError(404, "Product not found or not owned by you");
  res.json(new ApiResponse(true, "Product updated", product));
});

/** Update product (alias of edit) */
export const updateProduct = editProduct;

/** Soft delete product */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, farmer: farmerId });
  if (!product) throw new ApiError(404, "Product not found or not owned by you");

  await (product as any).softDelete();
  res.json(new ApiResponse(true, "Product deleted", { productId }));
});

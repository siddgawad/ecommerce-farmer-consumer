import { z } from "zod";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Farmer from "../models/Farmer.js";


export const ZProductCreateSchema = z.object({
  name: z.string().min(1),
  image: z.string().url().optional(),
  quantity: z.number().int().nonnegative().default(0),
  status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
  description: z.string().max(1000).optional(),
  priceCents: z.number().int().nonnegative(),
  currency: z.enum(["USD", "INR", "EUR"]).default("USD"),
});
export const ZProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  image: z.string().url().optional(),
  quantity: z.number().int().nonnegative().optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
  description: z.string().max(1000).optional(),
  priceCents: z.number().int().nonnegative(),
  currency: z.enum(["USD", "INR", "EUR", "CAD"]),
});

const ZListQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
  q: z.string().max(100).optional(),
  sort: z.enum(["createdAt", "-createdAt", "name", "-name"]).default("-createdAt"),
});

export const listFarmerProducts = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;
  const { page, limit, status, q, sort } = ZListQuery.parse(req.query);

  const filter: any = { farmer: farmerId };
  if (status) filter.status = status;
  if (q) filter.name = { $regex: q, $options: "i" };

  const skip = (page - 1) * limit;
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    createdAt: { createdAt: 1 },
    "-createdAt": { createdAt: -1 },
    name: { name: 1 },
    "-name": { name: -1 },
  };

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort]).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  res.json(new ApiResponse(true, "OK", { items, page, limit, total }));
});


export const farmerDashboard = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;

  const [productCount, productIds] = await Promise.all([
    Product.countDocuments({ farmer: farmerId }),
    Product.find({ farmer: farmerId }).distinct("_id"),
  ]);

  const ordersCount = await Order.countDocuments({ "items.product": { $in: productIds } });

  res.json(new ApiResponse(true, "OK", { productCount, ordersCount }));
});


export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;
  const body = ZProductCreateSchema.parse(req.body);
  body.currency = body.currency.toUpperCase() as any;

  const product = await Product.create({ ...body, farmer: farmerId });

  //keep a products array on Farmer
  await Farmer.updateOne({ _id: farmerId }, { $addToSet: { products: product._id } }).catch(() => {});

  res.status(201).json(new ApiResponse(true, "Product created", product));
});


export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;
  const { productId } = req.params;
  const body = ZProductUpdateSchema.parse(req.body);
  if (body.currency) body.currency = body.currency.toUpperCase() as any;

  const product = await Product.findOneAndUpdate(
    { _id: productId, farmer: farmerId },
    { $set: body },
    { new: true }
  );

  if (!product) throw new ApiError(404, "Product not found or not owned by you");
  res.json(new ApiResponse(true, "Product updated", product));
});


export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const farmerId = (req as any).user?.id as string;
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId, farmer: farmerId });
  if (!product) throw new ApiError(404, "Product not found or not owned by you");

  await (product as any).softDelete?.();
  res.json(new ApiResponse(true, "Product deleted", { productId }));
});

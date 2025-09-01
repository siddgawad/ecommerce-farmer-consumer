import { z } from "zod";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { createStripeCheckout } from "../payments/stripe.js";

/** Zod Schemas */
export const ZCheckoutSchema = z.object({
  provider: z.literal("stripe").optional().default("stripe"),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive().max(999),
    })
  ).min(1),
});

export const ZOrderActionSchema = z.object({
  reason: z.string().max(500).optional(),
});

/** Browsing for logged-in users */
export const listLoggedInProducts = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Product.find({ status: "active" }).sort({ createdAt: -1 }).limit(24);
  res.json(new ApiResponse(true, "OK", items));
});

export const getProductForUser = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json(new ApiResponse(false, "Product not found", null));
  res.json(new ApiResponse(true, "OK", product));
});

/** Checkout → create pending order + Stripe session */
export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const { items } = ZCheckoutSchema.parse(req.body);
  const userId = (req as any).user?.id as string;

  // Load products & validate
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, status: "active" });
  if (products.length !== productIds.length) throw new ApiError(400, "Some products unavailable");

  // Build order items snapshot
  const orderItems = items.map(i => {
    const p = products.find(pp => pp.id === i.productId)!;
    if (p.quantity < i.quantity) throw new ApiError(400, `Insufficient stock for ${p.name}`);
    return { product: p._id, nameSnapshot: p.name, quantity: i.quantity };
  });

  // Create pending order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    status: "pending",
    provider: "stripe",
  });

  // Create Stripe Checkout session (or stub if STRIPE_SECRET_KEY unset)
  const payment = await createStripeCheckout(order);

  // Persist provider ref
  order.providerRef = payment.id;
  await order.save();

  res.status(201).json(new ApiResponse(true, "Checkout created", {
    orderId: order.id,
    provider: "stripe",
    providerRef: payment.id,
    redirectUrl: payment.url,
  }));
});

/** Orders */
export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as string;
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  res.json(new ApiResponse(true, "OK", orders));
});

export const listOrdersByProduct = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as string;
  const { productId } = req.params;
  const orders = await Order.find({ user: userId, "items.product": productId }).sort({ createdAt: -1 });
  res.json(new ApiResponse(true, "OK", orders));
});

export const requestReturn = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as string;
  const { orderId } = req.params;
  const { reason } = ZOrderActionSchema.parse(req.body);

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, "Order not found");

  if (order.status !== "paid") throw new ApiError(400, "Only paid orders can be returned");
  order.status = "returned";
  await order.save();

  res.json(new ApiResponse(true, "Return requested", { orderId: order.id, reason: reason || null }));
});

export const requestCancel = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as string;
  const { orderId } = req.params;
  const { reason } = ZOrderActionSchema.parse(req.body);

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, "Order not found");

  if (order.status !== "pending") throw new ApiError(400, "Only pending orders can be cancelled");
  order.status = "cancelled";
  await order.save();

  res.json(new ApiResponse(true, "Order cancelled", { orderId: order.id, reason: reason || null }));
});

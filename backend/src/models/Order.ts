import mongoose, { Schema, model, type Document, type Types } from "mongoose";
import { softDeletePlugin } from "./plugins.js";

export type OrderStatus = "pending" | "paid" | "cancelled" | "returned";
export type PaymentProvider = "stripe" | "razorpay";

export interface IOrderItem {
  product: Types.ObjectId;
  nameSnapshot: string;  // capture at time of order
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  provider?: PaymentProvider;
  providerRef?: string;   // e.g., Stripe session id or Razorpay order id
  isDeleted?: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    nameSnapshot: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [OrderItemSchema], required: true, validate: [(v: IOrderItem[]) => v.length > 0, "Empty order"] },
    status: { type: String, enum: ["pending", "paid", "cancelled", "returned"], default: "pending", index: true },
    provider: { type: String, enum: ["stripe", "razorpay"], required: false },
    providerRef: { type: String },
  },
  { timestamps: true }
);

OrderSchema.plugin(softDeletePlugin);

const Order = model<IOrder>("Order", OrderSchema);
export default Order;

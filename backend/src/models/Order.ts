import { Schema, model, type Document, type Types } from "mongoose";
import { softDeletePlugin } from "./plugins.js";

export type OrderStatus = "pending" | "paid" | "cancelled" | "returned" | "failed";
export type PaymentProvider = "stripe";

export interface IOrderItem {
  product: Types.ObjectId;
  nameSnapshot: string;
  priceCents: number; // snapshot at purchase time
  currency: string;   // snapshot currency
  quantity: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];

  amountCents: number; // total snapshot
  currency: string;    // single currency per order

  status: OrderStatus;
  provider: PaymentProvider;
  providerRef?: string | null;

  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    nameSnapshot: { type: String, required: true },
    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(v: IOrderItem[]) => v.length > 0, "Empty order"],
    },

    amountCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },

    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "returned", "failed"],
      default: "pending",
      index: true,
    },
    provider: { type: String, enum: ["stripe"], default: "stripe" },
    providerRef: { type: String, default: null },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ "items.product": 1, createdAt: -1 });

OrderSchema.plugin(softDeletePlugin);

export default model<IOrder>("Order", OrderSchema);

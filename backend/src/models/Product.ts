import { Schema, model, type Document, type Types } from "mongoose";
import { softDeletePlugin } from "./plugins.js";

export type ProductStatus = "active" | "inactive" | "out_of_stock";

export interface IProduct extends Document {
  name: string;
  image?: string;
  quantity: number;
  status: ProductStatus;
  description?: string;
  farmer: Types.ObjectId;

  // NEW
  priceCents: number; // minor units (e.g., 1299 == $12.99)
  currency: string;   // "USD" | "INR" | "EUR" (UPPERCASE)

  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
      index: true,
    },
    description: { type: String },
    farmer: { type: Schema.Types.ObjectId, ref: "Farmer", required: true, index: true },

    priceCents: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, default: "USD" },
  },
  { timestamps: true }
);

// Helpful virtual id alias
ProductSchema.virtual("productId").get(function (this: IProduct) {
  return this._id?.toString();
});
ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

// Indexes for fast reads
ProductSchema.index({ farmer: 1, createdAt: -1 }); // farmer dashboard
ProductSchema.index({ farmer: 1, name: 1 });       // farmer search by name
ProductSchema.index({ status: 1, createdAt: -1 }); // public list newest active

ProductSchema.plugin(softDeletePlugin);

export default model<IProduct>("Product", ProductSchema);

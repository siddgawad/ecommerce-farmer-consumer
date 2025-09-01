import mongoose, { Schema, model, type Document, type Types } from "mongoose";
import { softDeletePlugin } from "./plugins.js";

export type ProductStatus = "active" | "inactive" | "out_of_stock";

export interface IProduct extends Document {
  name: string;
  image?: string;
  quantity: number;
  status: ProductStatus;
  description?: string;
  farmer: Types.ObjectId; // Farmer reference
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
  },
  { timestamps: true }
);

// Helpful virtual id alias (productId)
ProductSchema.virtual("productId").get(function (this: IProduct) {
  // @ts-ignore
  return this._id?.toString();
});
ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

ProductSchema.plugin(softDeletePlugin);

const Product = model<IProduct>("Product", ProductSchema);
export default Product;

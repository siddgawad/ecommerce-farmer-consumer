import mongoose, { Schema, model, type Document, type Types } from "mongoose";
import { softDeletePlugin } from "./plugins.js";

export interface IFarmer extends Document {
  name: string;
  email: string;
  contact?: string;
  address?: string;
  products: Types.ObjectId[];
  orders: Types.ObjectId[];
  role: "farmer";
  password: string; // hashed
  isDeleted?: boolean;
  deletedAt?: Date;
}

const FarmerSchema = new Schema<IFarmer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contact: { type: String },
    address: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    role: { type: String, enum: ["farmer"], default: "farmer", required: true },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  { timestamps: true }
);

FarmerSchema.index({ email: 1 }, { unique: true });

FarmerSchema.plugin(softDeletePlugin);

const Farmer = model<IFarmer>("Farmer", FarmerSchema);
export default Farmer;

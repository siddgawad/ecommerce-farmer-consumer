import mongoose, { Schema, model, type Document, type Types } from "mongoose";
import { softDeletePlugin } from "./plugins.js";

export type UserRole = "user" | "farmer" | "admin";

export interface IUser extends Document {
  name: string;
  address?: string;
  email: string;
  contact?: string;
  browsingHistory: Types.ObjectId[];
  orders: Types.ObjectId[];
  role: UserRole;
  password: string; // hashed
  isDeleted?: boolean;
  deletedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contact: { type: String },
    browsingHistory: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    role: { type: String, enum: ["user", "farmer", "admin"], default: "user" },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.plugin(softDeletePlugin);

const User = model<IUser>("User", UserSchema);
export default User;

import mongoose from "mongoose";
import env from "../config/env.js";
import { logger } from "../config/logger.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected");
  } catch (err: any) {
    logger.error(`MongoDB connection error: ${err?.message || err}`);
    process.exit(1);
  }
}

import type { Schema } from "mongoose";

/**
 * Soft-delete plugin:
 * - adds { isDeleted: boolean, deletedAt?: Date }
 * - hides soft-deleted docs from all .find*() unless { withDeleted: true } is passed in query options
 * - adds doc.softDelete()
 *
 * Usage:
 *   schema.plugin(softDeletePlugin)
 *   Model.find({}, null, { withDeleted: true }) // include deleted
 */
export function softDeletePlugin(schema: Schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: undefined },
  });

  // Hide deleted by default on find queries
  schema.pre(/^find/, function (next) {
    // @ts-ignore - getOptions exists at runtime on query
    const opts = this.getOptions?.() || {};
    if (!opts.withDeleted) {
      // @ts-ignore - where exists on query
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  });

  // Optional: hide deleted in countDocuments too
  schema.pre("countDocuments", function (next) {
    // @ts-ignore
    const opts = this.getOptions?.() || {};
    if (!opts.withDeleted) {
      // @ts-ignore
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  });

  // Instance helper
  // @ts-ignore
  schema.methods.softDelete = function () {
    // @ts-ignore
    this.isDeleted = true;
    // @ts-ignore
    this.deletedAt = new Date();
    // @ts-ignore
    return this.save();
  };
}

/** Extend Mongoose query options to support { withDeleted: true } */
declare module "mongoose" {
  interface QueryOptions {
    withDeleted?: boolean;
  }
}

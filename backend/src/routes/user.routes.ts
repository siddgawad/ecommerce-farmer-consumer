import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { auth, requireRoles } from "../middleware/auth.js";
import { rateLimitMiddleware, limiterAuth } from "../config/rateLimiter.js";

// Controllers + Zod schemas
import {
  userSignup,
  userSignin,
  userSignout,
  ZUserAuthSchema,
} from "../controllers/auth.controller.js";

import {
  listLoggedInProducts,
  getProductForUser,
  checkout,
  listMyOrders,
  listOrdersByProduct,
  requestReturn,
  requestCancel,
  ZCheckoutSchema,
  ZOrderActionSchema,
} from "../controllers/order.controller.js";

const router = Router();

/** Auth */
router.post("/signup", rateLimitMiddleware(limiterAuth), validate(ZUserAuthSchema), userSignup);
router.post("/signin", rateLimitMiddleware(limiterAuth), validate(ZUserAuthSchema), userSignin);
router.post("/signout", auth(), userSignout);

/** Browsing (logged-in) */
router.get("/browse", auth(), requireRoles("user", "admin", "farmer"), listLoggedInProducts);

// Keep spec path for product detail under user namespace as well
router.get("/browse/:productId", getProductForUser);

/** Checkout */
router.post("/checkout", auth(), validate(ZCheckoutSchema), checkout);

/** Orders */
router.get("/my-orders", auth(), listMyOrders);
router.get("/my-orders/:productId", auth(), listOrdersByProduct);
router.post("/my-orders/:orderId/return", auth(), validate(ZOrderActionSchema), requestReturn);
router.post("/my-orders/:orderId/cancel", auth(), validate(ZOrderActionSchema), requestCancel);

export default router;

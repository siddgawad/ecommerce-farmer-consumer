import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { auth } from "../middleware/auth.js";
import { rateLimitMiddleware, limiterAuth } from "../config/rateLimiter.js";

import {
  userSignup,
  userSignin,
  userSignout,
  ZUserSignupSchema,
  ZUserSigninSchema,
} from "../controllers/auth.controller.js";

import {
  checkout,
  listMyOrders,
  listOrdersByProduct,
  requestReturn,
  requestCancel,
  ZCheckoutSchema,
  ZOrderActionSchema,
} from "../controllers/order.controller.js";

import {
  listPublicProducts,
  getPublicProduct,
} from "../controllers/product.controller.js";

const router = Router();

/** Auth */
router.post("/signup", rateLimitMiddleware(limiterAuth), validate(ZUserSignupSchema), userSignup);
router.post("/signin", rateLimitMiddleware(limiterAuth), validate(ZUserSigninSchema), userSignin);
router.post("/signout", userSignout);

/** Browsing — public to keep parity pre/post login */
router.get("/browse", listPublicProducts);
router.get("/browse/:productId", getPublicProduct);

/** Checkout & Orders (auth) */
router.post("/checkout", auth(), validate(ZCheckoutSchema), checkout);
router.get("/my-orders", auth(), listMyOrders);
router.get("/my-orders/:productId", auth(), listOrdersByProduct);
router.post("/my-orders/:orderId/return", auth(), validate(ZOrderActionSchema), requestReturn);
router.post("/my-orders/:orderId/cancel", auth(), validate(ZOrderActionSchema), requestCancel);

export default router;

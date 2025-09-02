import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { auth, requireRoles } from "../middleware/auth.js";
import { rateLimitMiddleware, limiterAuth } from "../config/rateLimiter.js";

import {
  farmerSignup,
  farmerSignin,
  ZFarmerSignupSchema,
  ZFarmerSigninSchema,
} from "../controllers/auth.controller.js";

import {
  farmerDashboard,
  addProduct,
  deleteProduct,
  updateProduct,
  ZProductCreateSchema,
  ZProductUpdateSchema,
  listFarmerProducts,
} from "../controllers/farmer.controller.js";

const router = Router();

/** Auth */
router.post("/signup", rateLimitMiddleware(limiterAuth), validate(ZFarmerSignupSchema), farmerSignup);
router.post("/signin", rateLimitMiddleware(limiterAuth), validate(ZFarmerSigninSchema), farmerSignin);

/** Dashboard + products */
router.get("/dashboard", auth(), requireRoles("farmer", "admin"), farmerDashboard);
router.get("/dashboard/products", auth(), requireRoles("farmer", "admin"), listFarmerProducts);

router.post("/add-product", auth(), requireRoles("farmer", "admin"), validate(ZProductCreateSchema), addProduct);
router.patch("/update/:productId", auth(), requireRoles("farmer", "admin"), validate(ZProductUpdateSchema), updateProduct);
router.delete("/delete/:productId", auth(), requireRoles("farmer", "admin"), deleteProduct);

export default router;

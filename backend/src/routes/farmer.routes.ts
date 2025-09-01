import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { auth, requireRoles } from "../middleware/auth.js";
import { rateLimitMiddleware, limiterAuth } from "../config/rateLimiter.js";

import {
  farmerSignup,
  farmerSignin,
  ZFarmerAuthSchema,
} from "../controllers/auth.controller.js";

import {
  farmerDashboard,
  addProduct,
  editProduct,
  deleteProduct,
  updateProduct,
  ZProductCreateSchema,
  ZProductUpdateSchema,
} from "../controllers/farmer.controller.js";

const router = Router();

/** Extended domain (top-level /v1/* as per spec) */
router.post("/signup", rateLimitMiddleware(limiterAuth), validate(ZFarmerAuthSchema), farmerSignup);
router.post("/signin", rateLimitMiddleware(limiterAuth), validate(ZFarmerAuthSchema), farmerSignin);

router.get("/dashboard", auth(), requireRoles("farmer", "admin"), farmerDashboard);

router.post("/add-product", auth(), requireRoles("farmer", "admin"), validate(ZProductCreateSchema), addProduct);
router.patch("/edit/:productId", auth(), requireRoles("farmer", "admin"), validate(ZProductUpdateSchema), editProduct);
router.delete("/delete/:productId", auth(), requireRoles("farmer", "admin"), deleteProduct);
router.patch("/update/:productId", auth(), requireRoles("farmer", "admin"), validate(ZProductUpdateSchema), updateProduct);

export default router;

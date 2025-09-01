import { Router } from "express";
import { listPublicProducts, getPublicProduct } from "../controllers/product.controller.js";

const router = Router();

/**
 * "/"  -> public browsing page: list active, non-deleted products (paginated)
 */
router.get("/", listPublicProducts);

/**
 * Spec note: product detail was requested at /v1/user/browse/:productId but public.
 * We'll expose a truly public detail too (makes SEO sense). Keep both:
 *  - Public detail: GET /product/:productId
 *  - Also wired in user.routes under /v1/user/browse/:productId (same controller)
 */
router.get("/product/:productId", getPublicProduct);

export default router;

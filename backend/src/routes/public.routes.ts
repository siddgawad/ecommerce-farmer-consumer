import { Router } from "express";
import { listPublicProducts, getPublicProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/", listPublicProducts);
router.get("/product/:productId", getPublicProduct);

export default router;

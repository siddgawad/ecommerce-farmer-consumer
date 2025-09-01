import { Router } from "express";

// ESM local imports require .js extensions
import publicRoutes from "./public.routes.js";
import userRoutes from "./user.routes.js";
import farmerRoutes from "./farmer.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

// Health first (useful for probes)
router.use(healthRoutes);

// Public browsing (landing, product detail)
router.use(publicRoutes);

// Versioned domains
router.use("/v1/user", userRoutes); // -> /v1/user/*
router.use("/v1", farmerRoutes);    // -> /v1/signup, /v1/add-product, etc.

export default router;

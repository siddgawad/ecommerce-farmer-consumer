// src/app.ts
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import Stripe from "stripe";

// Local imports (NodeNext/ESM requires .js extensions)
import env from "./config/env.js";
import { morganStream } from "./config/logger.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { rateLimitMiddleware, limiterGeneral } from "./config/rateLimiter.js";
import { setStdHeaders } from "./middleware/response.js";

import Order from "./models/Order.js";
import Product from "./models/Product.js";


const app = express();

// Security & infra middleware (safe before JSON parser)
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms user=:user',
    { stream: morganStream }
  )
);
app.use(rateLimitMiddleware(limiterGeneral));
app.use(setStdHeaders);

// --- Stripe webhook (must use RAW body & be BEFORE express.json) ---
if (env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET) {
  // Narrow to plain strings for TS
  const stripeSecretKey: string = env.STRIPE_SECRET_KEY;
  const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" });

  app.post("/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
    const sig = req.headers["stripe-signature"];
    if (typeof sig !== "string") return res.status(400).send("Missing stripe-signature header");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.status !== "paid") {
          // decrement stock based on snapshots (best-effort; use transactions if you run a replica set)
          for (const it of order.items) {
            await Product.updateOne(
              { _id: it.product, quantity: { $gte: it.quantity } },
              { $inc: { quantity: -it.quantity } }
            );
          }
          order.status = "paid";
          await order.save();
        }
      }
    }
  
    return res.status(200).send("ok");
  });
}

// JSON body parser for all other routes (must come AFTER webhook raw body)
app.use(express.json({ limit: "1mb" }));

// Mount versioned/public routes
app.use(routes);

// 404 + centralized error handler
app.use(notFound);
app.use(errorHandler);

export default app;

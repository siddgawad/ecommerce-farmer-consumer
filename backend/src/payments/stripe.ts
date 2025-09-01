import Stripe from "stripe";
import env from "../config/env.js";
import type { IOrder } from "../models/Order.js";

/**
 * Create a Stripe Checkout Session for a pending order.
 * NOTE: This stub uses a placeholder amount (100 * totalQuantity) for demo.
 * Replace with real price data and line items from your Product model.
 */
export async function createStripeCheckout(order: IOrder) {
  if (!env.STRIPE_SECRET_KEY) {
    // Dev fallback: simulate session
    return { id: `test_stripe_${order.id}`, url: "#" };
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

  const totalQty = order.items.reduce((acc, it) => acc + it.quantity, 0);
  const amount = Math.max(50, totalQty * 100); // cents; replace with real

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/cancel",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `Order ${order.id}` },
          unit_amount: amount, // placeholder
        },
        quantity: 1,
      },
    ],
    metadata: { orderId: order.id },
  });

  return { id: session.id, url: session.url! };
}

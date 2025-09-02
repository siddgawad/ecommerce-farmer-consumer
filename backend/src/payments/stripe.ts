import Stripe from "stripe";
import env from "../config/env.js";
import type { IOrder } from "../models/Order.js";

let stripe: Stripe | null = null;
if (env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}

export async function createStripeCheckout(order: IOrder) {
  if (!stripe) {
    // Dev fallback if no Stripe key configured
    return { id: `test_stripe_${order.id}`, url: `${env.APP_URL || "http://localhost:3000"}/checkout/success?orderId=${order.id}` };
  }

  const line_items = order.items.map((it) => ({
    price_data: {
      currency: it.currency.toLowerCase(),
      unit_amount: it.priceCents,
      product_data: { name: it.nameSnapshot },
    },
    quantity: it.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${env.APP_URL || "http://localhost:3000"}/checkout/success?orderId=${order.id}`,
    cancel_url: `${env.APP_URL || "http://localhost:3000"}/checkout/cancel?orderId=${order.id}`,
    metadata: { orderId: String(order.id) },
  });

  return { id: session.id, url: session.url! };
}

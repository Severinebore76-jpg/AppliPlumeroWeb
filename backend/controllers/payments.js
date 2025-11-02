// backend/controllers/payments.js
import {
  createCheckoutSession,
  handleWebhook,
} from "../services/paymentService.js";

// 🔹 Crée une session Stripe Checkout
export const createSession = async (req, res, next) => {
  try {
    const session = await createCheckoutSession(req.body);
    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// 🔹 Réception des webhooks Stripe
export const webhookHandler = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];
    await handleWebhook(req.body, sig);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Stripe Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

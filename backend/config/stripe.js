// backend/config/stripe.js
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const isDev = process.env.NODE_ENV !== "production";

let stripeInstance;

if (!process.env.STRIPE_SECRET_KEY) {
  if (isDev) {
    console.warn(
      "⚠️ STRIPE_SECRET_KEY manquante — Stripe désactivé en mode dev",
    );

    // Création d'une instance mock pour éviter le crash
    stripeInstance = {
      charges: { create: async () => ({ id: "mock_charge" }) },
      customers: { create: async () => ({ id: "mock_customer" }) },
    };
  } else {
    console.error(
      "❌ Erreur critique : STRIPE_SECRET_KEY manquante en production",
    );
    process.exit(1);
  }
} else {
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });
}

export default stripeInstance;

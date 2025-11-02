// backend/config/stripe.js
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ Erreur : STRIPE_SECRET_KEY manquant dans .env");
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // version stable actuelle
});

export default stripe;

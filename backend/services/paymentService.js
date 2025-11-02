// backend/services/paymentService.js
import stripe from "../config/stripe.js";

/**
 * 🔹 Crée une session Stripe Checkout pour un paiement unique.
 * @param {Object} payload - Données du paiement (montant, description, etc.)
 * @returns {Object} - Session Stripe
 */
export const createCheckoutSession = async (payload) => {
  const { amount, currency = "eur", description, email } = payload;

  if (!amount || amount <= 0) {
    throw new Error("Montant de paiement invalide");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: description || "Paiement Plumero" },
          unit_amount: Math.round(amount * 100), // Stripe = centimes
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/paiement/succes`,
    cancel_url: `${process.env.FRONTEND_URL}/paiement/annule`,
  });

  return session;
};

/**
 * 🔹 Gère les événements Stripe envoyés via webhook.
 * @param {Object} body - Corps brut de la requête
 * @param {string} signature - Signature Stripe du header
 */
export const handleWebhook = async (body, signature) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Erreur de validation du webhook Stripe :", err.message);
    throw new Error("Webhook invalide");
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log("✅ Paiement réussi :", event.data.object.id);
      break;
    case "checkout.session.async_payment_failed":
      console.warn("⚠️ Paiement échoué :", event.data.object.id);
      break;
    default:
      console.log(`ℹ️ Événement Stripe reçu : ${event.type}`);
  }
};

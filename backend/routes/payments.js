// backend/routes/payments.js
import express from "express";
import { createSession, webhookHandler } from "../controllers/payments.js";

const router = express.Router();

// 🔹 Création d'une session de paiement Stripe
router.post("/create-session", createSession);

// 🔹 Réception du webhook Stripe (utilise express.raw pour conserver le body brut)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler,
);

export default router;

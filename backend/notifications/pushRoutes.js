// backend/notifications/pushRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { subscribe, unsubscribe, send } from "./pushController.js";

const router = express.Router();

// 🔹 Abonnement aux notifications push
router.post("/subscribe", protect, rateLimiter, subscribe);

// 🔹 Désabonnement
router.delete("/unsubscribe", protect, unsubscribe);

// 🔹 Envoi manuel ou ciblé d’une notification
router.post("/send", protect, rateLimiter, send);

export default router;

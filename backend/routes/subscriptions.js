// backend/routes/subscriptions.js
import express from "express";
import {
  getSubscriptions,
  createSubscription,
  cancelSubscription,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Toutes les routes nécessitent une authentification
router.use(protect);

// 🔹 Récupérer tous les abonnements de l’utilisateur
router.get("/", getSubscriptions);

// 🔹 Créer un nouvel abonnement
router.post("/", createSubscription);

// 🔹 Annuler un abonnement
router.delete("/:id", cancelSubscription);

export default router;

// backend/routes/notifications.js
import express from "express";
import {
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(protect);

// 🔹 Récupérer toutes les notifications de l'utilisateur
router.get("/", getUserNotifications);

// 🔹 Marquer une notification comme lue
router.patch("/:id/read", markAsRead);

// 🔹 Supprimer une notification
router.delete("/:id", deleteNotification);

export default router;

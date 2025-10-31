// backend/routes/analytics.js
import express from "express";
import {
  getOverviewStats,
  getRomanStats,
  getUserActivity,
} from "../controllers/analyticsController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Authentification requise
router.use(protect);

// 🔹 Statistiques globales — accès admin
router.get("/overview", requireRole("admin"), getOverviewStats);

// 🔹 Statistiques détaillées d’un roman (pour auteur ou admin)
router.get("/romans/:id", requireRole("author", "admin"), getRomanStats);

// 🔹 Historique d’activité (lectures, likes, commentaires)
router.get("/activity", getUserActivity);

export default router;

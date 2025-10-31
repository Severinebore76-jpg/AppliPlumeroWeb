// backend/routes/dashboard.js
import express from "express";
import {
  getDashboardOverview,
  getUserStats,
  getRomanStats,
} from "../controllers/dashboardController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Authentification obligatoire
router.use(protect);

// 🔹 Vue globale pour administrateurs
router.get("/overview", requireRole("admin"), getDashboardOverview);

// 🔹 Statistiques personnelles de l’utilisateur connecté
router.get("/user", getUserStats);

// 🔹 Statistiques des romans de l’auteur connecté
router.get("/romans", requireRole("author", "admin"), getRomanStats);

export default router;

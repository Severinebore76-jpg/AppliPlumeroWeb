// backend/routes/activity.js
import express from "express";
import {
  getUserActivity,
  getAllActivity,
  getRomanActivity,
} from "../controllers/activityController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Authentification obligatoire
router.use(protect);

// 🔹 Activité de l’utilisateur connecté
router.get("/me", getUserActivity);

// 🔹 Activité liée à un roman
router.get("/romans/:id", getRomanActivity);

// 🔹 Activité globale (admin)
router.get("/all", requireRole("admin"), getAllActivity);

export default router;

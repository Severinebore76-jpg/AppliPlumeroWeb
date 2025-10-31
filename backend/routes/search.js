// backend/routes/search.js
import express from "express";
import { globalSearch } from "../controllers/searchController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Recherche publique globale
router.get("/", globalSearch);

// 🔹 Recherche avancée (réservée admin si besoin)
router.get("/admin", protect, requireRole("admin"), globalSearch);

export default router;

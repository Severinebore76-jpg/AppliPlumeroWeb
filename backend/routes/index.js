// ============================================
// 🚦 Fichier : index.js
// ============================================
// Point d’entrée principal des routes backend
// AppliPlumeroWeb — Phase 1
// ============================================

import express from "express";
import authRoutes from "./auth.js";
import userRoutes from "./user.js";

const router = express.Router();

// 🧩 Routes principales
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

// 🧱 Route de test ou de santé
router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API opérationnelle" });
});

export default router;

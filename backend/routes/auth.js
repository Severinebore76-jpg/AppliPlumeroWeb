// ============================================
// 🚏 Fichier : auth.js
// ============================================
// Définition des routes d’authentification utilisateur
// AppliPlumeroWeb — Phase 1
// ============================================

import express from "express";
import {
  register,
  login,
  verifyTokenController,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧱 Routes publiques
router.post("/register", register);
router.post("/login", login);

// 🛡️ Route protégée : vérification du token JWT
router.get("/verify", protect, verifyTokenController);

export default router;

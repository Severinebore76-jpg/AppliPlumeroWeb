// backend/routes/sync.js
import express from "express";
import {
  syncPush,
  syncPull,
  syncMerge,
} from "../controllers/syncController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Authentification obligatoire pour toutes les routes
router.use(protect);

// 🔹 Envoi des données locales vers le serveur
router.post("/push", syncPush);

// 🔹 Récupération des données serveur
router.get("/pull", syncPull);

// 🔹 Fusion / synchronisation avancée (optionnelle)
router.patch("/merge", syncMerge);

export default router;

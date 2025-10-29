// backend/routes/comments.js
// 🔹 Routes pour la gestion des commentaires (création, lecture, modération)
import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  create,
  list,
  update,
  remove,
} from "../controllers/commentsController.js";

const router = express.Router({ mergeParams: true });

// --- Routes publiques ---
router.get("/:romanId", list); // 🔹 Liste des commentaires d'un roman (modérés uniquement)

// --- Routes protégées (user connecté) ---
router.post("/:romanId", protect, create); // 🔹 Ajouter un commentaire

// --- Routes de gestion/modération ---
router.put("/:id", protect, update); // 🔹 Modifier son commentaire (ou admin pour modération)
router.delete("/:id", protect, remove); // 🔹 Supprimer son commentaire (ou admin)

export default router;

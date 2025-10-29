// backend/routes/romans.js
// 🔹 Routes principales pour la gestion des romans et leurs commentaires associés
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  create,
  list,
  getBySlug,
  update,
  remove,
} from "../controllers/romansController.js";
import commentRoutes from "./comments.js"; // 🔹 on importe les routes de commentaires

const router = express.Router();

// --- Routes principales ---
router.get("/", list); // 🔹 Liste des romans
router.get("/:slug", getBySlug); // 🔹 Détail d’un roman via slug
router.post("/", protect, create); // 🔹 Créer un roman
router.put("/:id", protect, update); // 🔹 Modifier un roman
router.delete("/:id", protect, remove); // 🔹 Supprimer un roman

// --- Sous-route : commentaires liés à un roman ---
router.use("/:romanId/comments", commentRoutes); // 🔹 Imbrique les routes commentaires

export default router;

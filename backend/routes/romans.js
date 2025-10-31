// backend/routes/romans.js
import express from "express";
import {
  createRoman,
  getRomanBySlug,
  getAllRomans,
  updateRoman,
  deleteRoman,
} from "../controllers/romansController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { romanCreateSchema, romanUpdateSchema } from "../utils/validation.js";
import commentsRouter from "./comments.js";

const router = express.Router();

// 🔹 Routes publiques
router.get("/", getAllRomans);
router.get("/:slug", getRomanBySlug);

// 🔹 Routes protégées (authentifiées)
router.post("/", protect, validateRequest(romanCreateSchema), createRoman);
router.put("/:id", protect, validateRequest(romanUpdateSchema), updateRoman);
router.delete("/:id", protect, deleteRoman);

// 🔹 Sous-route : commentaires d’un roman
router.use("/:romanId/comments", commentsRouter);

export default router;

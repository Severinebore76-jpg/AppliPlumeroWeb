// backend/routes/users.js
import express from "express";
import { list, getOne, updateMe } from "../controllers/usersController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Routes publiques
router.get("/:id", getOne);

// 🔹 Routes protégées
router.use(protect);
router.put("/me", updateMe);

// 🔹 Routes admin uniquement
router.get("/", requireRole("admin"), list);

export default router;

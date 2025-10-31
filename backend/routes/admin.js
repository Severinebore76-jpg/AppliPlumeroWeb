// backend/routes/admin.js
import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getReports,
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Authentification + Vérification du rôle administrateur
router.use(protect, requireRole("admin"));

// 🔹 Gestion des utilisateurs
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// 🔹 Signalements et modération
router.get("/reports", getReports);

export default router;

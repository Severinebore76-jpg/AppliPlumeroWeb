// backend/routes/messages.js
import express from "express";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/messagesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Authentification requise pour toutes les routes
router.use(protect);

// 🔹 Récupérer les messages de l’utilisateur connecté
router.get("/", getMessages);

// 🔹 Envoyer un nouveau message
router.post("/", sendMessage);

// 🔹 Supprimer un message
router.delete("/:id", deleteMessage);

export default router;

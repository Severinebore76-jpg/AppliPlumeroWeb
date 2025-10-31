import {
  createMessage,
  getUserMessages,
  deleteMessage,
} from "../services/messageService.js";
import { createError } from "../utils/errorResponse.js";

// ✉️ Envoyer un message
export const send = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    if (!recipientId || !content)
      throw createError(400, "Données incomplètes pour l’envoi du message");

    const message = await createMessage(req.user._id, recipientId, content);
    res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};

// 📥 Récupérer les messages (envoyés/reçus)
export const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const messages = await getUserMessages(req.user._id, page, limit);
    res.status(200).json({ success: true, page, limit, messages });
  } catch (err) {
    next(err);
  }
};

// ❌ Supprimer un message
export const remove = async (req, res, next) => {
  try {
    const deleted = await deleteMessage(req.params.id, req.user._id);
    if (!deleted) throw createError(404, "Message introuvable ou non autorisé");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

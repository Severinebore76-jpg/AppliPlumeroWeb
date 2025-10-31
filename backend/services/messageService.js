import Message from "../models/Message.js";
import { createError } from "../utils/errorResponse.js";
import { checkOwnershipOrAdmin } from "../utils/permissions.js";
import { createNotification } from "./notificationService.js";

/**
 * ✉️ Envoi d’un message entre utilisateurs
 */
export const sendMessage = async (fromUser, toUser, content) => {
  if (!toUser || !content) {
    throw createError(400, "Destinataire et contenu obligatoires");
  }

  const message = await Message.create({
    fromUser,
    toUser,
    content,
    read: false,
  });

  // 🔔 Notification automatique
  await createNotification({
    toUser,
    fromUser,
    type: "message",
    message: "Nouveau message reçu",
  });

  return message;
};

/**
 * 📬 Récupérer les messages d’un utilisateur
 */
export const getMessages = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    $or: [{ fromUser: userId }, { toUser: userId }],
  })
    .populate("fromUser", "name avatarUrl")
    .populate("toUser", "name avatarUrl")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Message.countDocuments({
    $or: [{ fromUser: userId }, { toUser: userId }],
  });

  return { messages, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * 🟢 Marquer un message comme lu
 */
export const markAsRead = async (messageId, userId) => {
  const message = await Message.findById(messageId);
  if (!message) throw createError(404, "Message introuvable");

  if (message.toUser.toString() !== userId.toString()) {
    throw createError(403, "Accès refusé — vous n’êtes pas le destinataire");
  }

  message.read = true;
  await message.save();
  return message;
};

/**
 * ❌ Supprimer un message (expéditeur ou destinataire)
 */
export const deleteMessage = async (id, user) => {
  const message = await Message.findById(id);
  if (!message) throw createError(404, "Message introuvable");

  checkOwnershipOrAdmin(message, user);
  await message.deleteOne();

  return { message: "Message supprimé avec succès" };
};

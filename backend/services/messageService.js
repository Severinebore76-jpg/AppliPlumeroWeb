// ============================================================================
// 📦 Service : messageService.js
// 🔹 Bloc : Phase 2 — Romans, Commentaires & Profils Utilisateurs
// 🔹 Rôle : Gestion des messages privés entre utilisateurs
// ============================================================================

import Message from "../models/Message.js";
import { activityService } from "./activityService.js";
import { sendNotification } from "./notificationService.js";

export const messageService = {
  /**
   * 🟢 Envoie un message à un autre utilisateur
   */
  async sendMessage(senderId, receiverId, content) {
    if (!content?.trim()) throw new Error("Le contenu du message est requis.");
    if (senderId.toString() === receiverId.toString())
      throw new Error("Impossible de s’envoyer un message à soi-même.");

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content.trim(),
    });

    // Journaliser l’action
    await activityService.logActivity(
      senderId,
      "send_message",
      message._id,
      "Message",
      true,
    );

    // Notifier le destinataire
    await sendNotification({
      user: receiverId,
      type: "new_message",
      message: "Vous avez reçu un nouveau message privé.",
      relatedId: message._id,
    });

    return message;
  },

  /**
   * 🔵 Récupère les messages entre deux utilisateurs
   */
  async getConversation(userId, otherUserId, limit = 50) {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId, isDeletedBySender: false },
        { sender: otherUserId, receiver: userId, isDeletedByReceiver: false },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("sender", "username avatarUrl")
      .populate("receiver", "username avatarUrl")
      .lean();

    return messages.reverse(); // ordre chronologique
  },

  /**
   * 🧭 Récupère les dernières conversations de l’utilisateur
   */
  async getUserConversations(userId, limit = 10) {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId, isDeletedBySender: false },
            { receiver: userId, isDeletedByReceiver: false },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            sender: "$sender",
            receiver: "$receiver",
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      { $limit: limit },
    ]);

    return Message.populate(
      messages.map((m) => m.lastMessage),
      [
        { path: "sender", select: "username avatarUrl" },
        { path: "receiver", select: "username avatarUrl" },
      ],
    );
  },

  /**
   * 🟠 Marque un message comme lu
   */
  async markAsRead(messageId, userId) {
    const message = await Message.findById(messageId);
    if (!message) throw new Error("Message introuvable.");
    if (message.receiver.toString() !== userId.toString())
      throw new Error("Non autorisé à marquer ce message comme lu.");

    message.readAt = new Date();
    message.status = "read";
    await message.save();

    await activityService.logActivity(
      userId,
      "read_message",
      message._id,
      "Message",
      true,
    );
    return message;
  },

  /**
   * 🔴 Suppression logique d’un message
   */
  async deleteMessage(messageId, userId) {
    const message = await Message.findById(messageId);
    if (!message) throw new Error("Message introuvable.");

    if (message.sender.toString() === userId.toString()) {
      message.isDeletedBySender = true;
    } else if (message.receiver.toString() === userId.toString()) {
      message.isDeletedByReceiver = true;
    } else {
      throw new Error("Non autorisé à supprimer ce message.");
    }

    await message.save();
    await activityService.logActivity(
      userId,
      "delete_message",
      message._id,
      "Message",
      true,
    );
    return true;
  },

  /**
   * ⚙️ Compte les messages non lus d’un utilisateur
   */
  async countUnreadMessages(userId) {
    return Message.countDocuments({
      receiver: userId,
      status: { $ne: "read" },
      isDeletedByReceiver: false,
    });
  },
};

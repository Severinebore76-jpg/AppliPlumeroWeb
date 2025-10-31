import Notification from "../models/Notification.js";
import { createError } from "../utils/errorResponse.js";

/**
 * 🔔 Créer une nouvelle notification
 * @param {Object} data - Données de la notification (toUser, fromUser, type, message)
 */
export const createNotification = async (data) => {
  if (!data.toUser || !data.type || !data.message) {
    throw createError(400, "Données de notification incomplètes");
  }

  const notification = await Notification.create({
    ...data,
    read: false,
  });

  return notification;
};

/**
 * 📬 Récupérer les notifications d’un utilisateur
 * @param {string} userId - ID de l’utilisateur connecté
 */
export const getNotifications = async (userId) => {
  const notifications = await Notification.find({ toUser: userId })
    .populate("fromUser", "name avatarUrl")
    .sort({ read: 1, createdAt: -1 });

  return notifications;
};

/**
 * 🟢 Marquer une notification comme lue
 * @param {string} id - ID de la notification
 * @param {string} userId - ID du propriétaire
 */
export const markAsRead = async (id, userId) => {
  const notif = await Notification.findOne({ _id: id, toUser: userId });
  if (!notif) throw createError(404, "Notification introuvable");

  notif.read = true;
  await notif.save();

  return notif;
};

/**
 * 🧹 Marquer toutes les notifications comme lues
 * @param {string} userId - ID du propriétaire
 */
export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { toUser: userId, read: false },
    { read: true },
  );
  return { message: "Toutes les notifications ont été marquées comme lues." };
};

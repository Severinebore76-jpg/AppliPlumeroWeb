// backend/services/notificationService.js
import Notification from "../models/Notification.js";
import { createError } from "../utils/errorResponse.js";
import { sendPushNotification } from "../notifications/pushService.js";
import logger from "../utils/logger.js";

/**
 * 🔔 Créer une nouvelle notification
 */
export const createNotification = async (data) => {
  if (!data.toUser || !data.type || !data.message) {
    throw createError(400, "Données de notification incomplètes");
  }

  const notification = await Notification.create({
    ...data,
    read: false,
  });

  try {
    await sendPushNotification(data.toUser, data.message);
    logger.info(`🔔 Notification push envoyée à ${data.toUser}`);
  } catch (err) {
    logger.warn(`⚠️ Push non envoyé : ${err.message}`);
  }

  return notification;
};

/**
 * 📬 Récupérer les notifications d’un utilisateur
 */
export const getNotifications = async (userId) => {
  return Notification.find({ toUser: userId })
    .populate("fromUser", "name avatarUrl")
    .sort({ read: 1, createdAt: -1 });
};

/**
 * 🟢 Marquer une notification comme lue
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
 */
export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { toUser: userId, read: false },
    { read: true },
  );
  return { message: "Toutes les notifications ont été marquées comme lues." };
};

/**
 * 📦 Créer un lot de notifications (batch)
 */
export const createNotificationBatch = async (userIds = [], data = {}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw createError(
      400,
      "Aucun utilisateur cible pour le batch de notifications",
    );
  }
  if (!data.message) {
    throw createError(400, "Message de notification requis");
  }

  const docs = userIds.map((id) => ({
    toUser: id,
    fromUser: data.fromUser || null,
    title: data.title || "Notification",
    type: data.type || "info",
    message: data.message,
    read: false,
  }));

  const created = await Notification.insertMany(docs);

  // On tente d'envoyer un push pour chaque notif, sans faire échouer le batch
  for (const notif of created) {
    try {
      await sendPushNotification(notif.toUser, notif.message);
    } catch (err) {
      logger.warn(`⚠️ Push non envoyé à ${notif.toUser}: ${err.message}`);
    }
  }

  logger.info(`✅ Batch créé: ${created.length} notifications`);
  return created;
};

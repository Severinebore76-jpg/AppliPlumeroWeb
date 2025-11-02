// backend/notifications/pushController.js
import {
  subscribeUser,
  unsubscribeUser,
  sendPushNotification,
} from "../services/pushService.js";
import { createError } from "../utils/errorResponse.js";

/**
 * Enregistre un nouvel abonnement push
 */
export const subscribe = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    if (!subscription) throw createError(400, "Abonnement push manquant");
    const result = await subscribeUser(req.user._id, subscription);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * Supprime un abonnement push
 */
export const unsubscribe = async (req, res, next) => {
  try {
    await unsubscribeUser(req.user._id);
    res.json({ success: true, message: "Abonnement supprimé" });
  } catch (err) {
    next(err);
  }
};

/**
 * Envoie une notification à un ou plusieurs utilisateurs
 */
export const send = async (req, res, next) => {
  try {
    const { title, message, userIds } = req.body;
    if (!title || !message)
      throw createError(400, "Titre et message sont requis");
    const result = await sendPushNotification({ title, message, userIds });
    res.status(200).json({ success: true, delivered: result });
  } catch (err) {
    next(err);
  }
};

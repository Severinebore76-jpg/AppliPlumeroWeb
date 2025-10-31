import {
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../services/notificationService.js";
import { createError } from "../utils/errorResponse.js";

// 📬 Récupérer les notifications de l’utilisateur connecté
export const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const notifications = await getUserNotifications(req.user._id, page, limit);
    res.status(200).json({ success: true, page, limit, notifications });
  } catch (err) {
    next(err);
  }
};

// 📨 Marquer une notification comme lue
export const read = async (req, res, next) => {
  try {
    const updated = await markAsRead(req.params.id, req.user._id);
    if (!updated) throw createError(404, "Notification introuvable");
    res.status(200).json({ success: true, notification: updated });
  } catch (err) {
    next(err);
  }
};

// ❌ Supprimer une notification
export const remove = async (req, res, next) => {
  try {
    const deleted = await deleteNotification(req.params.id, req.user._id);
    if (!deleted) throw createError(404, "Notification introuvable");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

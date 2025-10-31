import ActivityLog from "../models/ActivityLog.js";
import { createError } from "../utils/errorResponse.js";

/**
 * 🧾 Enregistre une action utilisateur
 */
export const logActivity = async ({
  user,
  action,
  entity,
  entityId,
  details,
}) => {
  if (!user || !action)
    throw createError(400, "Action ou utilisateur manquant");

  return await ActivityLog.create({
    user,
    action,
    entity: entity || "system",
    entityId: entityId || null,
    details: details || {},
  });
};

/**
 * 📋 Récupère les activités récentes
 */
export const getRecentActivities = async (limit = 20) => {
  const logs = await ActivityLog.find({})
    .populate("user", "name role avatarUrl")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return logs;
};

/**
 * 🔍 Récupère les activités par utilisateur
 */
export const getUserActivity = async (userId, limit = 20, page = 1) => {
  const skip = (page - 1) * limit;

  const activities = await ActivityLog.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await ActivityLog.countDocuments({ user: userId });
  return {
    activities,
    page,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * 🧹 Nettoie les anciens logs (optionnel)
 */
export const cleanupOldActivities = async (days = 90) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const deleted = await ActivityLog.deleteMany({ createdAt: { $lt: cutoff } });
  return { deletedCount: deleted.deletedCount };
};

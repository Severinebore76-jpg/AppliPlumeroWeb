// ============================================================================
// 📦 Service : activityService.js
// 🔹 Phase 2 — Romans, Commentaires & Profils Utilisateurs
// 🔹 Rôle : Gestion des journaux d’activité & audit des actions utilisateur
// ============================================================================

import ActivityLog from "../models/ActivityLog.js";
import { sendNotification } from "../services/notificationService.js";

/**
 * Service centralisé de journalisation.
 * Chaque action importante (création, suppression, modération, etc.)
 * est enregistrée dans la collection ActivityLog.
 */
export const activityService = {
  /**
   * 🟢 Enregistre une nouvelle activité
   */
  async logActivity(
    userId,
    action,
    targetId = null,
    targetType = null,
    success = true,
    meta = {},
  ) {
    try {
      const log = await ActivityLog.create({
        user: userId,
        action,
        targetId,
        targetType,
        success,
        meta,
      });

      // Option : notifier un utilisateur spécifique
      if (meta.notify && meta.message && meta.to) {
        await sendNotification({
          user: meta.to,
          type: "system_alert",
          message: meta.message,
          relatedId: targetId,
        });
      }

      return log;
    } catch (err) {
      console.error(`[ActivityService] Erreur logActivity(): ${err.message}`);
      throw new Error("Impossible d’enregistrer l’activité utilisateur.");
    }
  },

  /**
   * 🔵 Récupère les logs récents d’un utilisateur
   */
  async getUserLogs(userId, limit = 50) {
    return ActivityLog.find({ user: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("action targetType success createdAt meta")
      .lean();
  },

  /**
   * 🟠 Filtre les logs par type d’action
   */
  async getLogsByAction(action, limit = 50) {
    return ActivityLog.find({ action, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  },

  /**
   * 🧭 Recherche avancée pour la console admin
   */
  async searchLogs(filters = {}) {
    const query = { isDeleted: false };

    if (filters.userId) query.user = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.targetType) query.targetType = filters.targetType;
    if (filters.success !== undefined) query.success = filters.success;
    if (filters.dateRange) {
      query.createdAt = {
        $gte: new Date(filters.dateRange.start),
        $lte: new Date(filters.dateRange.end),
      };
    }

    return ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "username role")
      .lean();
  },

  /**
   * 🔴 Suppression logique d’un log
   */
  async softDeleteLog(logId) {
    const result = await ActivityLog.updateOne(
      { _id: logId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
    );
    return result.modifiedCount > 0;
  },

  /**
   * ⚙️ Purge automatique des logs anciens
   */
  async purgeOldLogs(days = 90) {
    const limitDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: limitDate },
      isDeleted: true,
    });

    console.info(
      `[ActivityService] Purge : ${result.deletedCount} logs supprimés`,
    );
    return result.deletedCount;
  },
};

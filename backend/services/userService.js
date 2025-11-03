// ============================================================================
// 📦 Service : userService.js
// 🔹 Bloc : Phase 2 — Romans, Commentaires & Profils Utilisateurs
// 🔹 Rôle : Gestion des profils, préférences et statistiques utilisateur
// ============================================================================

import User from "../models/User.js";
import Roman from "../models/Roman.js";
import Comment from "../models/Comment.js";
import { activityService } from "./activityService.js";
import { feedbackService } from "./feedbackService.js";
import { deviceService } from "./deviceService.js";

/**
 * Service métier pour la gestion complète des profils utilisateurs
 */
export const userService = {
  /**
   * 🔵 Récupère le profil public d’un utilisateur
   */
  async getPublicProfile(userId) {
    const user = await User.findById(userId)
      .select("username bio avatarUrl socialLinks createdAt")
      .lean();

    if (!user) throw new Error("Utilisateur introuvable.");

    const [romanCount, commentCount] = await Promise.all([
      Roman.countDocuments({ author: userId, isDeleted: false }),
      Comment.countDocuments({ author: userId, isDeleted: false }),
    ]);

    return { ...user, romanCount, commentCount };
  },

  /**
   * 🧭 Récupère le profil complet (privé) pour l’utilisateur connecté
   */
  async getPrivateProfile(userId) {
    const user = await User.findById(userId)
      .select("-password -refreshToken -__v")
      .populate("devices", "deviceId os browser active")
      .lean();

    if (!user) throw new Error("Utilisateur introuvable.");
    return user;
  },

  /**
   * 🟢 Met à jour les informations de profil
   */
  async updateProfile(userId, updates) {
    const user = await User.findById(userId);
    if (!user) throw new Error("Utilisateur introuvable.");

    // Champs protégés
    const protectedFields = ["email", "password", "role", "createdAt"];
    for (const field of protectedFields) delete updates[field];

    Object.assign(user, updates);
    await user.save();

    await activityService.logActivity(
      userId,
      "update_profile",
      user._id,
      "User",
      true,
    );
    return user;
  },

  /**
   * 🔴 Suppression logique du compte utilisateur
   */
  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error("Utilisateur introuvable.");

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    // Désactivation des appareils liés
    await deviceService.deactivateDevices(userId);

    await activityService.logActivity(
      userId,
      "delete_user",
      user._id,
      "User",
      true,
    );
    return true;
  },

  /**
   * ⚙️ Récupère les statistiques personnelles de l’utilisateur
   */
  async getUserStats(userId) {
    const [romanCount, commentCount, recentActivity] = await Promise.all([
      Roman.countDocuments({ author: userId, isDeleted: false }),
      Comment.countDocuments({ author: userId, isDeleted: false }),
      activityService.getUserLogs(userId, 5),
    ]);

    return {
      totalRomans: romanCount,
      totalComments: commentCount,
      recentActivity,
    };
  },

  /**
   * 💬 Récupère les feedbacks envoyés par l’utilisateur
   */
  async getUserFeedbacks(userId) {
    return feedbackService.getFeedbackByUser(userId);
  },

  /**
   * 🧩 Met à jour les préférences utilisateur
   */
  async updatePreferences(userId, preferences) {
    const user = await User.findById(userId);
    if (!user) throw new Error("Utilisateur introuvable.");

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    await activityService.logActivity(
      userId,
      "update_preferences",
      user._id,
      "User",
      true,
    );
    return user.preferences;
  },
};

import User from "../models/User.js";
import Roman from "../models/Roman.js";
import Comment from "../models/Comment.js";
import ActivityLog from "../models/ActivityLog.js";
import { createError } from "../utils/errorResponse.js";

/**
 * 👥 Liste les utilisateurs avec pagination
 */
export const listUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("name email role isVerified createdAt")
    .lean();

  const total = await User.countDocuments();
  return { users, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * 🧱 Change le rôle d’un utilisateur
 */
export const changeUserRole = async (userId, role) => {
  if (!["user", "admin"].includes(role))
    throw createError(400, "Rôle invalide");

  const updated = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  ).select("name email role");

  if (!updated) throw createError(404, "Utilisateur introuvable");
  return updated;
};

/**
 * 🚫 Supprime un utilisateur et ses données associées
 */
export const deleteUserAndData = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw createError(404, "Utilisateur introuvable");

  await Promise.all([
    Roman.deleteMany({ author: userId }),
    Comment.deleteMany({ author: userId }),
    ActivityLog.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  return { message: `Utilisateur ${user.name} et données associées supprimés` };
};

/**
 * 📊 Statistiques globales pour le dashboard
 */
export const getGlobalStats = async () => {
  const [users, romans, comments] = await Promise.all([
    User.countDocuments(),
    Roman.countDocuments(),
    Comment.countDocuments(),
  ]);

  const latestUsers = await User.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .select("name email createdAt")
    .lean();

  return {
    totalUsers: users,
    totalRomans: romans,
    totalComments: comments,
    recentUsers: latestUsers,
    generatedAt: new Date(),
  };
};

/**
 * 🔍 Audit d’activité (les 20 dernières actions)
 */
export const getRecentActivity = async () => {
  const logs = await ActivityLog.find({})
    .populate("user", "name role")
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return logs;
};

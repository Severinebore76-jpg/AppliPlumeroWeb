import Subscription from "../models/Subscription.js";
import { createError } from "../utils/errorResponse.js";
import { createNotification } from "./notificationService.js";

/**
 * ➕ S’abonner à un utilisateur
 */
export const followUser = async (followerId, followingId) => {
  if (followerId.toString() === followingId.toString()) {
    throw createError(400, "Impossible de s’abonner à soi-même");
  }

  const existing = await Subscription.findOne({
    follower: followerId,
    following: followingId,
  });
  if (existing) {
    throw createError(400, "Vous suivez déjà cet utilisateur");
  }

  const subscription = await Subscription.create({
    follower: followerId,
    following: followingId,
  });

  // 🔔 Notification automatique
  await createNotification({
    toUser: followingId,
    fromUser: followerId,
    type: "subscription",
    message: "Un nouvel utilisateur vous suit",
  });

  return subscription;
};

/**
 * ➖ Se désabonner
 */
export const unfollowUser = async (followerId, followingId) => {
  const deleted = await Subscription.findOneAndDelete({
    follower: followerId,
    following: followingId,
  });

  if (!deleted) {
    throw createError(404, "Abonnement introuvable");
  }

  return { message: "Désabonnement effectué avec succès" };
};

/**
 * 👥 Liste des utilisateurs suivis
 */
export const getFollowing = async (userId, limit = 20, page = 1) => {
  const skip = (page - 1) * limit;
  const following = await Subscription.find({ follower: userId })
    .populate("following", "name avatarUrl")
    .skip(skip)
    .limit(limit);

  const total = await Subscription.countDocuments({ follower: userId });
  return { following, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * 👀 Liste des abonnés
 */
export const getFollowers = async (userId, limit = 20, page = 1) => {
  const skip = (page - 1) * limit;
  const followers = await Subscription.find({ following: userId })
    .populate("follower", "name avatarUrl")
    .skip(skip)
    .limit(limit);

  const total = await Subscription.countDocuments({ following: userId });
  return { followers, total, page, totalPages: Math.ceil(total / limit) };
};

import Roman from "../models/Roman.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import BookStats from "../models/BookStats.js";
import ReadingProgress from "../models/ReadingProgress.js";

/**
 * 📊 Vue d’ensemble du tableau de bord
 */
export const getOverview = async () => {
  const [romans, comments, users, stats] = await Promise.all([
    Roman.countDocuments(),
    Comment.countDocuments(),
    User.countDocuments(),
    BookStats.aggregate([
      {
        $group: {
          _id: null,
          totalReads: { $sum: "$reads" },
          totalLikes: { $sum: "$likes" },
          totalBookmarks: { $sum: "$bookmarks" },
        },
      },
    ]),
  ]);

  return {
    totalRomans: romans,
    totalComments: comments,
    totalUsers: users,
    totalReads: stats[0]?.totalReads || 0,
    totalLikes: stats[0]?.totalLikes || 0,
    totalBookmarks: stats[0]?.totalBookmarks || 0,
  };
};

/**
 * 📈 Statistiques d’activité sur les 30 derniers jours
 */
export const getActivityStats = async () => {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [newUsers, newRomans, newComments] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: since } }),
    Roman.countDocuments({ createdAt: { $gte: since } }),
    Comment.countDocuments({ createdAt: { $gte: since } }),
  ]);

  return { newUsers, newRomans, newComments, since };
};

/**
 * 🏆 Top 5 des romans les plus populaires
 */
export const getTopRomans = async (limit = 5) => {
  const topRomans = await Roman.find({ visibility: "public" })
    .sort({ "stats.reads": -1, "stats.likes": -1 })
    .limit(limit)
    .select("title slug coverUrl stats author");

  return topRomans;
};

/**
 * 🧠 Statistiques utilisateur (vue profil)
 */
export const getUserStats = async (userId) => {
  const [romans, reads, likes] = await Promise.all([
    Roman.countDocuments({ author: userId }),
    ReadingProgress.countDocuments({ user: userId }),
    BookStats.aggregate([
      { $match: { author: userId } },
      {
        $group: {
          _id: "$author",
          totalReads: { $sum: "$reads" },
          totalLikes: { $sum: "$likes" },
        },
      },
    ]),
  ]);

  return {
    totalRomans: romans,
    totalReads: reads,
    totalLikes: likes[0]?.totalLikes || 0,
  };
};

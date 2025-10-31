import User from "../models/User.js";
import Roman from "../models/Roman.js";
import Comment from "../models/Comment.js";
import ActivityLog from "../models/ActivityLog.js";

/**
 * 📊 Statistiques globales
 */
export const getGlobalAnalytics = async () => {
  const [totalUsers, totalRomans, totalComments, totalReads] =
    await Promise.all([
      User.countDocuments(),
      Roman.countDocuments({ status: "published" }),
      Comment.countDocuments({ status: "approved" }),
      Roman.aggregate([
        { $group: { _id: null, reads: { $sum: "$stats.reads" } } },
      ]),
    ]);

  const reads = totalReads[0]?.reads || 0;

  return {
    totalUsers,
    totalRomans,
    totalComments,
    totalReads: reads,
    generatedAt: new Date(),
  };
};

/**
 * 📈 Évolution sur 7 jours glissants
 */
export const getWeeklyTrends = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [newUsers, newRomans, newComments] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Roman.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Comment.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
  ]);

  return {
    newUsers,
    newRomans,
    newComments,
    since: sevenDaysAgo,
  };
};

/**
 * 🔥 Top 5 des romans les plus lus
 */
export const getTopRomans = async (limit = 5) => {
  const romans = await Roman.find({ status: "published" })
    .sort({ "stats.reads": -1 })
    .limit(limit)
    .select("title author stats.reads coverUrl slug")
    .populate("author", "name")
    .lean();

  return romans;
};

/**
 * 🧭 Activité utilisateur récente
 */
export const getRecentActivityAnalytics = async (limit = 10) => {
  const logs = await ActivityLog.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name role")
    .lean();

  return logs.map((log) => ({
    user: log.user?.name || "Utilisateur inconnu",
    action: log.action,
    entity: log.entity,
    createdAt: log.createdAt,
  }));
};

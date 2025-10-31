import Roman from "../models/Roman.js";
import BookStats from "../models/BookStats.js";
import ReadingProgress from "../models/ReadingProgress.js";

/**
 * 🔍 Trouver des romans similaires par tags
 * @param {string} userId - ID de l’utilisateur connecté
 * @param {number} limit - Nombre de recommandations
 */
export const getRecommendations = async (userId, limit = 10) => {
  // 1️⃣ Récupère les tags des romans lus
  const userReads = await ReadingProgress.find({ user: userId })
    .populate("roman", "tags")
    .lean();

  const tags = [...new Set(userReads.flatMap((r) => r.roman.tags || []))];
  if (tags.length === 0) {
    // Si l’utilisateur n’a rien lu, renvoyer les plus populaires
    return getTrendingRomans(limit);
  }

  // 2️⃣ Recherche de romans ayant des tags similaires
  const recommendations = await Roman.find({
    tags: { $in: tags },
    visibility: "public",
  })
    .sort({ "stats.likes": -1, createdAt: -1 })
    .limit(limit)
    .select("title slug tags summary coverUrl author stats");

  return recommendations;
};

/**
 * 📈 Récupère les romans les plus lus / aimés
 */
export const getTrendingRomans = async (limit = 10) => {
  const trending = await Roman.find({ visibility: "public" })
    .sort({ "stats.reads": -1, "stats.likes": -1 })
    .limit(limit)
    .select("title slug tags summary coverUrl author stats");

  return trending;
};

/**
 * 🕒 Recommandations mixtes : tags + popularité + récence
 */
export const getSmartRecommendations = async (userId, limit = 10) => {
  const userReads = await ReadingProgress.find({ user: userId })
    .populate("roman", "tags")
    .lean();

  const tags = [...new Set(userReads.flatMap((r) => r.roman.tags || []))];

  const romans = await Roman.aggregate([
    { $match: { visibility: "public", tags: { $in: tags } } },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: [{ $size: "$tags" }, 1.5] },
            "$stats.likes",
            { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 100000000] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit },
  ]);

  return romans;
};

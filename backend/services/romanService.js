import Roman from "../models/Roman.js";
import Comment from "../models/Comment.js";
import { calculateAverageRating } from "../services/ratingService.js";
import { logActivity } from "../services/activityService.js";
import { generateSlug } from "../utils/slugify.js";

export const romanService = {
  async createRoman(data, userId) {
    const { title, synopsis, language, genres, tags } = data;

    // Génération du slug unique
    const slug = generateSlug(title);
    const existing = await Roman.findOne({ slug, author: userId });
    if (existing) throw new Error("Un roman portant ce titre existe déjà.");

    const roman = await Roman.create({
      ...data,
      author: userId,
      slug,
      stats: { views: 0, likes: 0, commentsCount: 0, chaptersCount: 0 },
    });

    await logActivity(userId, "create_roman", roman._id, "Roman", true);
    return roman;
  },

  async getRomanBySlug(slug) {
    const roman = await Roman.findOne({ slug, isDeleted: false })
      .populate("author", "username avatarUrl")
      .lean();

    if (!roman) throw new Error("Roman introuvable.");
    return roman;
  },

  async getAllRomans(filters = {}) {
    const query = { isDeleted: false };

    if (filters.language) query.language = filters.language;
    if (filters.visibility) query.visibility = filters.visibility;
    if (filters.status) query.status = filters.status;

    return Roman.find(query)
      .sort({ publishedAt: -1 })
      .select("title slug author stats coverImage status visibility")
      .populate("author", "username avatarUrl")
      .lean();
  },

  async updateRoman(id, updates, userId) {
    const roman = await Roman.findById(id);
    if (!roman) throw new Error("Roman introuvable.");
    if (roman.author.toString() !== userId.toString())
      throw new Error("Non autorisé à modifier ce roman.");

    const protectedFields = ["author", "createdAt", "slug"];
    protectedFields.forEach((f) => delete updates[f]);

    Object.assign(roman, updates);
    await roman.save();
    await logActivity(userId, "update_roman", roman._id, "Roman", true);
    return roman;
  },

  async deleteRoman(id, userId) {
    const roman = await Roman.findById(id);
    if (!roman) throw new Error("Roman introuvable.");
    if (roman.author.toString() !== userId.toString())
      throw new Error("Non autorisé à supprimer ce roman.");

    roman.isDeleted = true;
    roman.deletedAt = new Date();
    roman.deletedBy = userId;
    await roman.save();
    await logActivity(userId, "delete_roman", roman._id, "Roman", true);
    return roman;
  },

  async incrementViews(slug) {
    return Roman.findOneAndUpdate(
      { slug, isDeleted: false },
      { $inc: { "stats.views": 1 } },
      { new: true },
    );
  },

  async refreshStats(romanId) {
    const [commentCount, avgRating] = await Promise.all([
      Comment.countDocuments({ roman: romanId, isDeleted: false }),
      calculateAverageRating(romanId),
    ]);

    const roman = await Roman.findByIdAndUpdate(
      romanId,
      {
        $set: {
          "stats.commentsCount": commentCount,
          "stats.ratings.average": avgRating.average,
          "stats.ratings.count": avgRating.count,
        },
      },
      { new: true },
    );

    return roman;
  },

  async searchRomans(query, limit = 10) {
    const regex = new RegExp(query, "i");
    return Roman.find({
      $or: [{ title: regex }, { synopsis: regex }, { tags: regex }],
      isDeleted: false,
      status: "published",
    })
      .limit(limit)
      .select("title slug author coverImage stats")
      .populate("author", "username")
      .lean();
  },
};

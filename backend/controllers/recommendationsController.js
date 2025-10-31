import { getUserRecommendations } from "../services/recommendationService.js";
import { createError } from "../utils/errorResponse.js";

// 📚 Obtenir les recommandations personnalisées
export const getRecommendations = async (req, res, next) => {
  try {
    if (!req.user) throw createError(401, "Authentification requise");

    const limit = Number(req.query.limit || 10);
    const recommendations = await getUserRecommendations(req.user._id, limit);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
};

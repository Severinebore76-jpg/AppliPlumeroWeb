import { searchRomans } from "../services/romanService.js";
import { createError } from "../utils/errorResponse.js";

// 🔎 Rechercher des romans par mot-clé, tag ou auteur
export const search = async (req, res, next) => {
  try {
    const query = req.query.q?.trim();
    if (!query) throw createError(400, "Paramètre de recherche manquant");

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const results = await searchRomans(query, page, limit);

    res.status(200).json({
      success: true,
      query,
      count: results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
};

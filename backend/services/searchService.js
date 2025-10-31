import Roman from "../models/Roman.js";
import { createError } from "../utils/errorResponse.js";

/**
 * 🔎 Recherche textuelle globale sur les romans
 * @param {string} query - Mot-clé à rechercher
 * @param {number} page - Page courante
 * @param {number} limit - Nombre de résultats par page
 * @param {boolean} includePrivate - Inclure les romans privés (admin uniquement)
 */
export const searchRomans = async (
  query,
  page = 1,
  limit = 10,
  includePrivate = false,
) => {
  if (!query || query.trim().length < 2) {
    throw createError(400, "Le terme de recherche est trop court ou manquant");
  }

  const skip = (page - 1) * limit;
  const filter = { $text: { $search: query } };

  if (!includePrivate) filter.visibility = "public";

  const romans = await Roman.find(filter, {
    score: { $meta: "textScore" },
  })
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("title slug author summary tags coverUrl status visibility");

  const total = await Roman.countDocuments(filter);

  return {
    results: romans,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

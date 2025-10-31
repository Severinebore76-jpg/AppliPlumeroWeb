import Roman from "../models/Roman.js";
import generateSlug from "../utils/slugify.js";
import { checkOwnershipOrAdmin } from "../utils/permissions.js";
import { createError } from "../utils/errorResponse.js";

// 🧩 Créer un nouveau roman
export const createRoman = async (data, user) => {
  const slug = generateSlug(data.title);
  const exists = await Roman.findOne({ slug });
  if (exists) throw createError(409, "Un roman avec ce titre existe déjà");

  const roman = await Roman.create({
    ...data,
    slug,
    author: user._id,
  });

  return roman;
};

// 🔍 Lister les romans (avec pagination + recherche)
export const listRomans = async (page = 1, limit = 10, query = {}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.visibility) filter.visibility = query.visibility;
  if (query.search) filter.$text = { $search: query.search };

  const romans = await Roman.find(filter)
    .populate("author", "name avatarUrl")
    .select(Roman.publicFields())
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Roman.countDocuments(filter);

  return { romans, total, page, totalPages: Math.ceil(total / limit) };
};

// 🧭 Récupérer un roman par son slug
export const getRomanBySlug = async (slug) => {
  const roman = await Roman.findOne({ slug })
    .populate("author", "name avatarUrl")
    .select("-__v");

  if (!roman) throw createError(404, "Roman introuvable");
  return roman;
};

// ✏️ Mettre à jour un roman (auteur ou admin)
export const updateRoman = async (id, updates, user) => {
  const roman = await Roman.findById(id);
  if (!roman) throw createError(404, "Roman introuvable");

  checkOwnershipOrAdmin(roman, user);

  if (updates.title && updates.title !== roman.title) {
    updates.slug = generateSlug(updates.title);
  }

  Object.assign(roman, updates);
  await roman.save();

  return roman;
};

// ❌ Supprimer un roman (auteur ou admin)
export const deleteRoman = async (id, user) => {
  const roman = await Roman.findById(id);
  if (!roman) throw createError(404, "Roman introuvable");

  checkOwnershipOrAdmin(roman, user);

  await roman.deleteOne();
  return { message: "Roman supprimé avec succès" };
};

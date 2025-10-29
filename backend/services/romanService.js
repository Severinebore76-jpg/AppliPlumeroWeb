import Roman from "../models/Romans.js";
import slugify from "../utils/slugify.js";
import { checkOwnershipOrAdmin } from "../utils/permissions.js";

// ➤ Création
export const createRoman = async (payload, authorId) => {
  const slug = slugify(payload.title);
  const exists = await Roman.findOne({ slug });
  if (exists) {
    const err = new Error("Un roman avec ce titre existe déjà.");
    err.statusCode = 409;
    throw err;
  }
  return Roman.create({ ...payload, slug, author: authorId });
};

// ➤ Liste (avec pagination, recherche, filtrage)
export const listRomans = async ({
  q,
  status,
  author,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (status) filter.status = status;
  if (author) filter.author = author;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Roman.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name email"),
    Roman.countDocuments(filter),
  ]);

  return {
    results: items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// ➤ Lecture
export const getRomanBySlug = (slug) =>
  Roman.findOne({ slug }).populate("author", "name email");

// ➤ Mise à jour
export const updateRoman = async (id, user, data) => {
  const roman = await Roman.findById(id);
  if (!roman) {
    const err = new Error("Roman introuvable");
    err.statusCode = 404;
    throw err;
  }

  checkOwnershipOrAdmin(roman, user);

  if (data.title) {
    const newSlug = slugify(data.title);
    const existing = await Roman.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existing) {
      const err = new Error("Un roman avec ce titre existe déjà.");
      err.statusCode = 409;
      throw err;
    }
    roman.title = data.title;
    roman.slug = newSlug;
  }

  [
    "summary",
    "tags",
    "coverUrl",
    "status",
    "visibility",
    "chapters",
    "isFeatured",
  ].forEach((k) => {
    if (data[k] !== undefined) roman[k] = data[k];
  });

  await roman.save();
  return roman;
};

// ➤ Suppression
export const deleteRoman = async (id, user) => {
  const roman = await Roman.findById(id);
  if (!roman) {
    const err = new Error("Roman introuvable");
    err.statusCode = 404;
    throw err;
  }

  checkOwnershipOrAdmin(roman, user);

  await roman.deleteOne();
  return true;
};

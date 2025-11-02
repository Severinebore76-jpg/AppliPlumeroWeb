import Comment from "../models/Comment.js";
import Roman from "../models/Roman.js";
import { createError } from "../utils/errorResponse.js";
import { checkOwnershipOrAdmin } from "../utils/permissions.js";

// 🧩 Créer un commentaire lié à un roman
export const createComment = async (romanId, user, data) => {
  const roman = await Roman.findById(romanId);
  if (!roman) throw createError(404, "Roman introuvable");

  const comment = await Comment.create({
    roman: roman._id,
    author: user._id,
    text: data.text,
  });

  return comment;
};

// 🔍 Lister les commentaires d’un roman (paginés, statut = approved)
export const listComments = async (romanId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const comments = await Comment.find({
    roman: romanId,
    status: "approved",
  })
    .populate("author", "name avatarUrl")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Comment.countDocuments({
    roman: romanId,
    status: "approved",
  });

  return { comments, total, page, totalPages: Math.ceil(total / limit) };
};

// ✏️ Modifier un commentaire (owner/admin)
export const updateComment = async (id, user, updates) => {
  const comment = await Comment.findById(id);
  if (!comment) throw createError(404, "Commentaire introuvable");

  checkOwnershipOrAdmin(comment, user);

  Object.assign(comment, updates);
  await comment.save();

  return comment;
};

// ❌ Supprimer un commentaire (owner/admin)
export const deleteComment = async (id, user) => {
  const comment = await Comment.findById(id);
  if (!comment) throw createError(404, "Commentaire introuvable");

  checkOwnershipOrAdmin(comment, user);

  await comment.deleteOne();
  return { message: "Commentaire supprimé avec succès" };
};
// ✅ Compatibilité : alias pour listComments
export const getCommentsByRoman = async (romanId) => {
  return await listComments(romanId);
};

import { checkOwnershipOrAdmin } from "../utils/permissions.js";
import Comment from "../models/Comment.js";

// ➤ Création d’un commentaire
export const createComment = async (romanId, authorId, text) => {
  if (!text || text.trim().length < 2) {
    const err = new Error("Le commentaire est trop court");
    err.statusCode = 400;
    throw err;
  }

  return Comment.create({ roman: romanId, author: authorId, text });
};

// ➤ Liste paginée des commentaires approuvés
export const listComments = async (romanId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Comment.find({ roman: romanId, status: "approved" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name"),
    Comment.countDocuments({ roman: romanId, status: "approved" }),
  ]);

  return {
    results: items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// ➤ Mise à jour (modération incluse)
export const updateComment = async (id, user, data) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    const err = new Error("Commentaire introuvable");
    err.statusCode = 404;
    throw err;
  }

  checkOwnershipOrAdmin(comment, user);

  if (data.text !== undefined) comment.text = data.text;
  if (user.role === "admin" && data.status) comment.status = data.status;

  await comment.save();
  return comment;
};

// ➤ Suppression
export const deleteComment = async (id, user) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    const err = new Error("Commentaire introuvable");
    err.statusCode = 404;
    throw err;
  }

  checkOwnershipOrAdmin(comment, user);

  await comment.deleteOne();
  return true;
};

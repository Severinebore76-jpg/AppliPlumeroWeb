import {
  createComment,
  getCommentsByRoman,
  updateComment,
  deleteComment,
} from "../services/commentService.js";
import {
  commentCreateSchema,
  commentUpdateSchema,
} from "../utils/validation.js";
import { createError } from "../utils/errorResponse.js";

// ➕ Ajouter un commentaire à un roman
export const create = async (req, res, next) => {
  try {
    const { error, value } = commentCreateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw createError(400, "Données invalides", error.details);

    const comment = await createComment(
      req.params.romanId,
      req.user._id,
      value.text,
    );
    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
};

// 📋 Lister les commentaires d’un roman
export const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const comments = await getCommentsByRoman(req.params.romanId, page, limit);
    res.json({ page, limit, results: comments });
  } catch (err) {
    next(err);
  }
};

// ✏️ Modifier un commentaire
export const update = async (req, res, next) => {
  try {
    const { error, value } = commentUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw createError(400, "Données invalides", error.details);

    const updated = await updateComment(req.params.id, req.user, value);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// 🗑️ Supprimer un commentaire
export const remove = async (req, res, next) => {
  try {
    await deleteComment(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

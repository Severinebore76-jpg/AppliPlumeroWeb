import {
  createComment,
  listComments,
  updateComment,
  deleteComment,
} from "../services/commentService.js";
import {
  commentCreateSchema,
  commentUpdateSchema,
} from "../utils/validation.js";
import { createError } from "../utils/errorResponse.js";

// ➤ Créer un commentaire
export const create = async (req, res, next) => {
  try {
    if (!req.user?._id) throw createError(401, "Authentification requise");

    const { error, value } = commentCreateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw createError(400, "Données invalides", error.details);

    const comment = await createComment(
      req.params.romanId,
      req.user._id,
      value.text
    );
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// ➤ Liste paginée des commentaires d’un roman
export const list = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const data = await listComments(
      req.params.romanId,
      Number(page || 1),
      Number(limit || 20)
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ➤ Mise à jour
export const update = async (req, res, next) => {
  try {
    const { error, value } = commentUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) throw createError(400, "Données invalides", error.details);

    const comment = await updateComment(req.params.id, req.user, value);
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// ➤ Suppression
export const remove = async (req, res, next) => {
  try {
    await deleteComment(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

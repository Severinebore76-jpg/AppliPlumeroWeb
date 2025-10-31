import {
  deleteUserByAdmin,
  deleteRomanByAdmin,
  moderateComment,
} from "../services/adminService.js";
import { createError } from "../utils/errorResponse.js";

// 🧑‍💼 Vérification des droits admin
const ensureAdmin = (user) => {
  if (!user || user.role !== "admin") {
    throw createError(403, "Accès réservé aux administrateurs");
  }
};

// 🗑️ Supprimer un utilisateur
export const deleteUser = async (req, res, next) => {
  try {
    ensureAdmin(req.user);
    const deleted = await deleteUserByAdmin(req.params.id);
    if (!deleted) throw createError(404, "Utilisateur introuvable");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 📚 Supprimer un roman et ses dépendances
export const deleteRoman = async (req, res, next) => {
  try {
    ensureAdmin(req.user);
    const deleted = await deleteRomanByAdmin(req.params.id);
    if (!deleted) throw createError(404, "Roman introuvable");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 💬 Modérer un commentaire (changer statut)
export const updateCommentStatus = async (req, res, next) => {
  try {
    ensureAdmin(req.user);
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw createError(400, "Statut de modération invalide");
    }

    const updated = await moderateComment(req.params.id, status);
    if (!updated) throw createError(404, "Commentaire introuvable");

    res.status(200).json({ success: true, updated });
  } catch (err) {
    next(err);
  }
};

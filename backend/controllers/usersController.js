import { getById, listUsers, updateUserMe } from "../services/userService.js";
import { updateMeSchema } from "../utils/validation.js";

export const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const users = await listUsers(page, limit);
    res.json({ page, limit, users });
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const user = await getById(req.params.id);
    if (!user) {
      const err = new Error("Utilisateur introuvable");
      err.statusCode = 404;
      throw err;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { error, value } = updateMeSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const err = new Error("Données invalides");
      err.statusCode = 400;
      err.details = error.details;
      throw err;
    }
    const user = await updateUserMe(req.user._id, value);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

import {
  createRoman,
  listRomans,
  getRomanBySlug,
  updateRoman,
  deleteRoman,
} from "../services/romanService.js";
import { romanCreateSchema, romanUpdateSchema } from "../utils/validation.js";

export const create = async (req, res, next) => {
  try {
    const { error, value } = romanCreateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const err = new Error("Données invalides");
      err.statusCode = 400;
      err.details = error.details;
      throw err;
    }
    const roman = await createRoman(value, req.user._id);
    res.status(201).json(roman);
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const { q, status, author, page, limit } = req.query;
    const data = await listRomans({
      q,
      status,
      author,
      page: Number(page || 1),
      limit: Number(limit || 20),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const roman = await getRomanBySlug(req.params.slug);
    if (!roman) {
      const err = new Error("Roman introuvable");
      err.statusCode = 404;
      throw err;
    }
    res.json(roman);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { error, value } = romanUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const err = new Error("Données invalides");
      err.statusCode = 400;
      err.details = error.details;
      throw err;
    }
    const roman = await updateRoman(req.params.id, req.user, value);
    res.json(roman);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteRoman(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

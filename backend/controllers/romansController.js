// backend/controllers/romansController.js
import {
  createRoman as serviceCreateRoman,
  getRomanBySlug as serviceGetRomanBySlug,
  getAllRomans as serviceGetAllRomans,
  updateRoman as serviceUpdateRoman,
  deleteRoman as serviceDeleteRoman,
  getPremiumChapters as serviceGetPremiumChapters,
} from "../services/romanService.js";
import { createError } from "../utils/errorResponse.js";

// ➕ Créer un roman
export const createRoman = async (req, res, next) => {
  try {
    const roman = await serviceCreateRoman(req.body, req.user);
    res.status(201).json(roman);
  } catch (err) {
    next(err);
  }
};

// 📜 Récupérer tous les romans
export const getAllRomans = async (req, res, next) => {
  try {
    const romans = await serviceGetAllRomans();
    res.json(romans);
  } catch (err) {
    next(err);
  }
};

// 🔍 Récupérer un roman par slug
export const getRomanBySlug = async (req, res, next) => {
  try {
    const roman = await serviceGetRomanBySlug(req.params.slug);
    if (!roman) throw createError(404, "Roman introuvable");
    res.json(roman);
  } catch (err) {
    next(err);
  }
};

// ✏️ Mettre à jour un roman
export const updateRoman = async (req, res, next) => {
  try {
    const updated = await serviceUpdateRoman(req.params.id, req.body, req.user);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// 🗑️ Supprimer un roman
export const deleteRoman = async (req, res, next) => {
  try {
    await serviceDeleteRoman(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 💎 Récupérer les chapitres premium d’un roman
export const getPremiumChapters = async (req, res, next) => {
  try {
    const chapters = await serviceGetPremiumChapters(req.params.slug, req.user);
    res.json(chapters);
  } catch (err) {
    next(err);
  }
};

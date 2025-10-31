import {
  getOverviewStats,
  getTrendsStats,
  getTopRomans,
} from "../services/analyticsService.js";
import { createError } from "../utils/errorResponse.js";

// 📈 Vue d’ensemble globale (utilisateurs, romans, lectures)
export const getOverview = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw createError(403, "Accès réservé aux administrateurs");
    }
    const stats = await getOverviewStats();
    res.status(200).json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

// 📊 Évolution hebdomadaire ou mensuelle
export const getTrends = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw createError(403, "Accès réservé aux administrateurs");
    }
    const period = req.query.period || "7d";
    const trends = await getTrendsStats(period);
    res.status(200).json({ success: true, trends });
  } catch (err) {
    next(err);
  }
};

// 🏆 Romans les plus populaires
export const getTopRomans = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const top = await getTopRomans(limit);
    res.status(200).json({ success: true, top });
  } catch (err) {
    next(err);
  }
};

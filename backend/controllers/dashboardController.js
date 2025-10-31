import {
  getDashboardOverview,
  getRecentActivity,
} from "../services/dashboardService.js";
import { createError } from "../utils/errorResponse.js";

// 📊 Vue d’ensemble du tableau de bord
export const overview = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      throw createError(403, "Accès réservé aux administrateurs");

    const stats = await getDashboardOverview();
    res.status(200).json({ success: true, stats });
  } catch (err) {
    next(err);
  }
};

// 🕓 Activité récente (romans, users, commentaires)
export const activity = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      throw createError(403, "Accès réservé aux administrateurs");

    const recent = await getRecentActivity();
    res.status(200).json({ success: true, recent });
  } catch (err) {
    next(err);
  }
};

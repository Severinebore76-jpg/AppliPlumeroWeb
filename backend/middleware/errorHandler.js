// ============================================
// 📁 backend/middleware/errorHandler.js
// Middleware global de gestion des erreurs
// ============================================

import { STATUS_CODES } from "../constants/statusCodes.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";

export const errorHandler = (err, req, res, next) => {
  // --- Journalisation serveur ---
  console.error("❌ Error:", err.stack || err.message);

  // --- Statut HTTP par défaut ---
  const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;

  // --- Message cohérent ---
  const message =
    err.message && typeof err.message === "string"
      ? err.message
      : ERROR_MESSAGES.INTERNAL_ERROR;

  // --- Structure de réponse unifiée ---
  const errorResponse = {
    success: false,
    status: statusCode,
    message,
  };

  // --- Détails optionnels (validation Joi, etc.) ---
  if (err.details) {
    errorResponse.details = Array.isArray(err.details)
      ? err.details.map((d) => ({
          field: d.path?.join(".") || "unknown",
          message: d.message,
        }))
      : err.details;
  }

  // --- Stack visible uniquement en développement ---
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  // --- Envoi de la réponse ---
  res.status(statusCode).json(errorResponse);
};

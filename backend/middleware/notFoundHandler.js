// ============================================
// 📁 backend/middleware/notFoundHandler.js
// Gestion des routes non trouvées (404)
// ============================================

import { STATUS_CODES } from "../constants/statusCodes.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";

export const notFoundHandler = (req, res, next) => {
  const error = new Error(
    `${ERROR_MESSAGES.ROUTE_NOT_FOUND} — ${req.originalUrl}`,
  );
  error.statusCode = STATUS_CODES.NOT_FOUND;
  next(error);
};

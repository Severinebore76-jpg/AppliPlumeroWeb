// backend/middleware/errorHandler.js

// 🧩 Middleware de gestion d'erreurs global
export const errorHandler = (err, req, res, next) => {
  // Log complet côté serveur
  console.error("❌ Error:", err.stack || err.message);

  // Code de statut HTTP (par défaut 500)
  const statusCode = err.statusCode || 500;

  // Réponse d'erreur normalisée
  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || "Erreur serveur interne",
  };

  // Si des détails existent (ex: validation Joi)
  if (err.details) {
    errorResponse.details = Array.isArray(err.details)
      ? err.details.map((d) => ({
          field: d.path?.join(".") || "unknown",
          message: d.message,
        }))
      : err.details;
  }

  // Inclure la stack uniquement en dev
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

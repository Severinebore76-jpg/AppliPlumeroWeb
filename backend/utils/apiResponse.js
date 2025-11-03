// ============================================
// 🧩 Fichier : apiResponse.js
// ============================================
// Helper pour unifier les réponses JSON du backend
// ============================================

/**
 * Envoie une réponse JSON standardisée pour les succès
 * @param {object} res - Objet Response d'Express
 * @param {number} statusCode - Code HTTP
 * @param {string} message - Message de confirmation
 * @param {object} [data] - Données optionnelles à renvoyer
 */
export const success = (
  res,
  statusCode = 200,
  message = "Opération réussie",
  data = null,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data }),
  });
};

/**
 * Envoie une réponse JSON standardisée pour les erreurs
 * @param {object} res - Objet Response d'Express
 * @param {number} statusCode - Code HTTP d’erreur
 * @param {string} message - Message d’erreur
 * @param {object} [details] - Détails optionnels de l’erreur
 */
export const error = (
  res,
  statusCode = 500,
  message = "Erreur interne du serveur",
  details = null,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

/**
 * Fonction générique pour renvoyer une réponse simple (utile pour le health check)
 * @param {object} res - Objet Response d'Express
 * @param {string} message - Message texte
 */
export const info = (res, message = "Information") => {
  return res.status(200).json({
    success: true,
    message,
  });
};

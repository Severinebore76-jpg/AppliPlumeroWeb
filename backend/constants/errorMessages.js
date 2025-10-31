// ============================================
// 📁 backend/constants/errorMessages.js
// Centralisation des messages d'erreur de l'app
// ============================================

export const ERROR_MESSAGES = {
  // --- Authentification ---
  INVALID_CREDENTIALS: "Identifiants incorrects.",
  UNAUTHORIZED: "Accès non autorisé. Veuillez vous reconnecter.",
  TOKEN_MISSING: "Aucun token fourni.",
  TOKEN_INVALID: "Token invalide ou expiré.",

  // --- Utilisateurs ---
  USER_NOT_FOUND: "Utilisateur introuvable.",
  USER_ALREADY_EXISTS: "Un compte avec cet email existe déjà.",

  // --- Romans ---
  ROMAN_NOT_FOUND: "Roman introuvable.",
  ROMAN_UNAUTHORIZED: "Vous n’êtes pas autorisé à modifier ce roman.",

  // --- Commentaires ---
  COMMENT_NOT_FOUND: "Commentaire introuvable.",
  COMMENT_UNAUTHORIZED: "Vous n’êtes pas autorisé à modifier ce commentaire.",

  // --- Validation ---
  VALIDATION_ERROR: "Erreur de validation des données envoyées.",
  MISSING_FIELDS: "Certains champs obligatoires sont manquants.",

  // --- Serveur / Générique ---
  INTERNAL_ERROR: "Erreur interne du serveur. Réessayez plus tard.",
  DB_CONNECTION_FAILED: "Échec de connexion à la base de données.",
  ROUTE_NOT_FOUND: "Route non trouvée.",
};

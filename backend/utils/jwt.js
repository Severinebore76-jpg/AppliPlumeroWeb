// backend/utils/jwt.js
import jwt from "jsonwebtoken";

/**
 * Configuration sécurisée du JWT
 * On garde des valeurs par défaut uniquement pour le dev local
 */
const JWT_SECRET = process.env.JWT_SECRET || "change_me_dev_only";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * 🔐 Génère un token JWT signé
 * @param {Object} payload - Données à inclure dans le token (ex: { id, role })
 * @returns {String} Token signé
 */
export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (err) {
    console.error("Erreur génération JWT:", err.message);
    throw new Error("Échec lors de la génération du token");
  }
};

/**
 * ✅ Vérifie et décode un token JWT
 * @param {String} token - Token JWT à vérifier
 * @returns {Object} Payload décodé si valide
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Le token a expiré");
    } else if (err.name === "JsonWebTokenError") {
      throw new Error("Signature de token invalide");
    } else {
      throw new Error("Erreur de vérification du token");
    }
  }
};

/**
 * ♻️ Rafraîchit un token JWT (utile pour sessions longues)
 * @param {String} token - Ancien token JWT
 * @returns {String} Nouveau token
 */
export const refreshToken = (token) => {
  const decoded = verifyToken(token);
  const { iat, exp, ...payload } = decoded;
  return generateToken(payload);
};

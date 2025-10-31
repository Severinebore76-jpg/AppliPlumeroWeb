// backend/utils/securityUtils.js
import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Hash un mot de passe avec un salt sécurisé
 * @param {string} password - Mot de passe brut
 * @returns {Promise<string>} - Hash bcrypté
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

/**
 * Vérifie si un mot de passe correspond à son hash
 * @param {string} password - Mot de passe brut
 * @param {string} hash - Hash bcrypt stocké
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Génère un token sécurisé aléatoire (ex: reset password)
 * @param {number} size - Taille du token (par défaut : 32 octets)
 * @returns {string} - Token hexadécimal
 */
export const generateSecureToken = (size = 32) => {
  return crypto.randomBytes(size).toString("hex");
};

/**
 * Nettoie une chaîne de caractères pour éviter les injections basiques
 * @param {string} str - Chaîne brute
 * @returns {string} - Chaîne nettoyée
 */
export const sanitizeString = (str = "") => {
  return str.replace(/[<>$;]/g, "").trim();
};

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
 * Génère un code temporaire à 6 chiffres (2FA, validation email, etc.)
 * @param {number} length - Longueur du code numérique
 * @returns {string}
 */
export const generateVerificationCode = (length = 6) => {
  return crypto
    .randomInt(0, 10 ** length)
    .toString()
    .padStart(length, "0");
};

/**
 * Vérifie si un code est encore valide dans une fenêtre de temps donnée
 * @param {Date} createdAt - Date de création du code
 * @param {number} ttl - Durée de vie en secondes (par défaut : 5 minutes)
 * @returns {boolean}
 */
export const isCodeValid = (createdAt, ttl = 300) => {
  const now = Date.now();
  return now - new Date(createdAt).getTime() < ttl * 1000;
};

/**
 * Nettoie une chaîne de caractères pour éviter les injections basiques
 * @param {string} str - Chaîne brute
 * @returns {string} - Chaîne nettoyée
 */
export const sanitizeString = (str = "") => {
  return str.replace(/[<>$;]/g, "").trim();
};

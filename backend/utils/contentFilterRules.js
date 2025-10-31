// backend/utils/contentFilterRules.js

/**
 * Liste de mots et expressions à bloquer
 */
const bannedWords = [
  "spam",
  "scam",
  "porno",
  "violence",
  "terrorisme",
  "arnaque",
];

/**
 * Expression régulière pour détecter des liens ou scripts suspects
 */
const forbiddenPatterns = [
  /https?:\/\//i, // Liens externes
  /<script.*?>.*?<\/script>/i, // Scripts
  /onerror\s*=/i, // Injection d’événements
];

/**
 * Vérifie si un contenu respecte les règles de filtrage
 * @param {string} content - Contenu à analyser
 * @returns {object} - { valid: boolean, reason?: string }
 */
export const validateContent = (content = "") => {
  const lowerContent = content.toLowerCase();

  // Vérifie les mots interdits
  for (const word of bannedWords) {
    if (lowerContent.includes(word)) {
      return { valid: false, reason: `Mot interdit détecté : "${word}"` };
    }
  }

  // Vérifie les patterns interdits
  for (const regex of forbiddenPatterns) {
    if (regex.test(content)) {
      return { valid: false, reason: "Contenu suspect détecté." };
    }
  }

  return { valid: true };
};

// backend/utils/billingUtils.js

/**
 * Calcule le total TTC d’un panier ou d’une transaction
 * @param {number} amountHT - Montant hors taxe
 * @param {number} tva - Taux de TVA en %
 * @returns {number} - Montant TTC arrondi à 2 décimales
 */
export const calculateTotalTTC = (amountHT, tva = 20) => {
  const total = amountHT * (1 + tva / 100);
  return Math.round(total * 100) / 100;
};

/**
 * Applique une réduction en pourcentage
 * @param {number} amount - Montant initial
 * @param {number} discount - Pourcentage de réduction
 * @returns {number} - Nouveau montant après réduction
 */
export const applyDiscount = (amount, discount = 0) => {
  if (discount <= 0) return amount;
  const reduced = amount * (1 - discount / 100);
  return Math.round(reduced * 100) / 100;
};

/**
 * Valide qu’un montant est un nombre positif cohérent
 * @param {number} value - Montant à vérifier
 * @throws {Error} - Si invalide
 */
export const validateAmount = (value) => {
  if (typeof value !== "number" || isNaN(value) || value < 0) {
    throw new Error("Montant invalide ou négatif.");
  }
  return true;
};

/**
 * Convertit un montant en centimes (utilisé par Stripe)
 * @param {number} value - Montant en euros
 * @returns {number} - Montant en centimes arrondi
 */
export const toCents = (value) => Math.round(value * 100);

/**
 * Convertit un montant Stripe (centimes) en euros
 * @param {number} value - Montant en centimes
 * @returns {number} - Montant en euros arrondi
 */
export const fromCents = (value) => Math.round(value) / 100;

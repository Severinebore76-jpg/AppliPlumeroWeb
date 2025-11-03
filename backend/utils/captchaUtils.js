// ============================================
// 🔐 Fichier : captchaUtils.js
// ============================================
// Vérification serveur du token reCAPTCHA
// ============================================

import axios from "axios";

/**
 * Vérifie la validité d’un token reCAPTCHA côté serveur
 * @param {string} token - Token reçu du frontend
 * @returns {Promise<boolean>} - Retourne true si le CAPTCHA est valide
 */
export const verifyCaptcha = async (token) => {
  if (!token) return false;

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    );

    const data = response.data;
    return data.success === true && data.score >= 0.5;
  } catch (err) {
    console.error("Erreur CAPTCHA :", err.message);
    return false;
  }
};

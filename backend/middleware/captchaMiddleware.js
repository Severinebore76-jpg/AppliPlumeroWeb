// ============================================
// 🤖 Fichier : captchaMiddleware.js
// ============================================
// Vérification Google reCAPTCHA côté serveur
// AppliPlumeroWeb — Phase 1
// ============================================

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const captchaMiddleware = async (req, res, next) => {
  try {
    const token = req.body["g-recaptcha-response"] || req.body.token;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Token reCAPTCHA manquant dans la requête." });
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret,
          response: token,
          remoteip: req.ip,
        },
      },
    );

    const data = response.data;

    if (!data.success) {
      return res.status(403).json({
        message: "Échec de la vérification reCAPTCHA.",
        errors: data["error-codes"] || [],
      });
    }

    // Score (v3) facultatif
    if (data.score && data.score < 0.5) {
      return res
        .status(403)
        .json({ message: "Suspicion d'activité automatisée (score faible)." });
    }

    next();
  } catch (error) {
    console.error("Erreur reCAPTCHA :", error.message);
    return res.status(500).json({
      message: "Erreur lors de la vérification reCAPTCHA.",
      error: error.message,
    });
  }
};

// backend/middleware/twoFactorAuth.js
import User from "../models/User.js";

/**
 * 🔐 Middleware Two-Factor Authentication (2FA)
 * Vérifie que l'utilisateur a bien fourni le code de validation correct
 * avant d'accéder à certaines routes sensibles (paiements, profil, etc.)
 */

export const twoFactorAuth = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const code = req.headers["x-2fa-code"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié.",
      });
    }

    const user = await User.findById(userId).select(
      "+twoFactorCode +twoFactorEnabled",
    );

    // Si le 2FA n’est pas activé, on laisse passer
    if (!user.twoFactorEnabled) {
      return next();
    }

    // Si le code est manquant ou incorrect
    if (!code || code !== user.twoFactorCode) {
      return res.status(403).json({
        success: false,
        message: "Code de validation incorrect ou manquant.",
      });
    }

    // Si le code est correct, on réinitialise le champ et on poursuit
    user.twoFactorCode = null;
    await user.save();

    next();
  } catch (err) {
    console.error("Erreur 2FA:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la vérification du 2FA.",
    });
  }
};

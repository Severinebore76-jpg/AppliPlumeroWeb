// ============================================
// 🛡️ Fichier : adminMiddleware.js
// ============================================
// Vérification d'accès aux routes administrateur
// AppliPlumeroWeb — Phase 1
// ============================================

export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès refusé : privilèges administrateur requis." });
    }

    next();
  } catch (error) {
    console.error("Erreur middleware admin :", error);
    res
      .status(500)
      .json({ message: "Erreur interne dans le middleware administrateur." });
  }
};

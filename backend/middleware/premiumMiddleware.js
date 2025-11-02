// backend/middleware/premiumMiddleware.js

export const requirePremium = (req, res, next) => {
  try {
    if (!req.user) {
      const err = new Error("Authentification requise");
      err.statusCode = 401;
      throw err;
    }

    const hasPremium =
      req.user?.subscription?.active === true || req.user?.role === "admin";

    if (!hasPremium) {
      const err = new Error("Accès réservé aux membres premium");
      err.statusCode = 403;
      throw err;
    }

    next();
  } catch (err) {
    next(err);
  }
};

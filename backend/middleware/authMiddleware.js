import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];
    if (!token) {
      const err = new Error("Non autorisé — token manquant");
      err.statusCode = 401;
      throw err;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error("Utilisateur non trouvé");
      err.statusCode = 401;
      throw err;
    }

    req.user = user;
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 401;
    next(err);
  }
};

export const requireRole =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error("Accès interdit");
      err.statusCode = 403;
      throw err;
    }
    next();
  };

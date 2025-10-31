import User from "../models/User.js";
import { createError } from "../utils/errorResponse.js";
import { generateToken } from "../utils/jwt.js";
import { registerSchema, loginSchema } from "../utils/validation.js";

// Inscription
export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) throw createError(400, "Données invalides", error.details);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) throw createError(400, "Email déjà utilisé");

    const user = await User.create(req.body);
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

// Connexion
export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw createError(400, "Données invalides", error.details);

    const user = await User.findOne({ email: req.body.email }).select(
      "+password",
    );
    if (!user || !(await user.matchPassword(req.body.password))) {
      throw createError(401, "Identifiants incorrects");
    }

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

// Vérifier le token (ex: via /api/auth/verify)
export const verifyTokenController = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};

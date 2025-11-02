// backend/middleware/rateLimiter.js
import { RateLimiterMemory } from "rate-limiter-flexible";

/**
 * 🔐 Middleware de limitation de débit (rate limiting)
 * Objectif : empêcher les abus (brute-force, spam, flood API)
 * Chaque IP ne peut effectuer qu’un certain nombre de requêtes par minute.
 */

// --- Configuration globale ---
const rateLimiter = new RateLimiterMemory({
  points: 100, // nombre max de requêtes autorisées
  duration: 60, // fenêtre de temps (en secondes)
});

// --- Middleware Express ---
export const rateLimiterMiddleware = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    await rateLimiter.consume(ip); // consomme un "point" pour chaque requête
    next();
  } catch (err) {
    res.status(429).json({
      success: false,
      message: "Trop de requêtes. Réessayez dans quelques instants.",
    });
  }
};

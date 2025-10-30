/**
 * 🌐 Configuration CORS — AppliPlumeroWeb
 * ---------------------------------------
 * Définit les origines autorisées à interagir avec l’API.
 * En mode développement, autorise localhost.
 * En production, restreint aux domaines approuvés.
 */

const allowedOrigins = [
  "http://localhost:5173", // Frontend local (Vite)
  "https://plumero.com", // Domaine principal
  "https://www.plumero.com",
];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("⛔ Origine non autorisée par CORS"));
    }
  },
  credentials: true, // Autorise les cookies/sessions
  optionsSuccessStatus: 200, // Compatibilité avec certains navigateurs
};

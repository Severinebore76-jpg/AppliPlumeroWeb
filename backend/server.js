// ============================================
// 🚀 Fichier : backend/server.js
// ============================================
// Démarre l'application Express configurée
// dans app.js, charge les variables d'environnement,
// connecte MongoDB et gère les erreurs critiques.
// ============================================

import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ============================================
// 🌍 Chargement du .env (depuis la racine)
// ============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath, override: true });

// Vérification du chargement effectif
console.log("✅ Chargement du .env depuis :", envPath);
console.log("🔍 MONGO_URI =", process.env.MONGO_URI);
console.log(
  "🔍 STRIPE_SECRET_KEY =",
  process.env.STRIPE_SECRET_KEY || "❌ non définie",
);

// Valeur de secours Stripe (dev local sans clé réelle)
if (!process.env.STRIPE_SECRET_KEY) {
  process.env.STRIPE_SECRET_KEY = "fake_dev_key";
  console.warn("⚠️ STRIPE_SECRET_KEY absente → clé de dev utilisée.");
}

// ============================================
// 🧩 Imports dépendants de dotenv
// ============================================
import app from "./app.js";
import connectDB from "./config/db.js";

// ============================================
// 🗄️ Connexion à MongoDB
// ============================================
connectDB();

// ============================================
// ⚙️ Configuration du port et environnement
// ============================================
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || "development";

// ============================================
// 🚀 Lancement du serveur
// ============================================
const server = app.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur le port ${PORT} (${ENV})`);
});

// ============================================
// ⚠️ Gestion des erreurs non capturées
// ============================================
process.on("unhandledRejection", (err) => {
  console.error("❌ Rejet non géré :", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("💥 Exception non capturée :", err.message);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("🛑 Signal SIGTERM reçu → arrêt propre du serveur...");
  server.close(() => console.log("✅ Fermeture complète."));
});

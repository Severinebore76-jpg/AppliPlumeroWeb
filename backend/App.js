// ============================================
// 🌐 Fichier : backend/app.js
// ============================================
// Point d'entrée principal de l'application Express.
// Configure les middlewares globaux, la sécurité,
// les routes API, et exporte l'objet app.
// ============================================

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

// ⚠️ NE PAS importer dotenv ici → déjà géré dans server.js

// ============================================
// 🧩 Import internes
// ============================================
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import romanRoutes from "./routes/romans.js";
import userRoutes from "./routes/users.js";
import paymentRoutes from "./routes/payments.js";

// ============================================
// 🚀 Initialisation de l'application Express
// ============================================
const app = express();

// ============================================
// 🔒 Middlewares globaux
// ============================================
app.use(helmet()); // Sécurisation des headers HTTP
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || "*",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" })); // Parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Gestion cookies JWT / sessions
app.use(compression()); // Compression des réponses
app.use(morgan("dev")); // Logs HTTP

// ============================================
// 🚦 Route de test (vérification du serveur)
// ============================================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ============================================
// 📦 Routes principales
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/romans", romanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

// ============================================
// ⚠️ Middleware global de gestion des erreurs
// ============================================
app.use(errorHandler);

// ============================================
// 🧩 Export de l'application Express
// ============================================
export default app;

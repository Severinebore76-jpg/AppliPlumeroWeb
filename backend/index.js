// --- Modules de base ---
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// --- Sécurité ---
import helmet from "helmet";
import { securityHeaders } from "./middleware/securityHeaders.js";

// --- Base de données et middlewares globaux ---
import connectDB from "./config/db.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

// --- Imports des routes principales ---
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import romanRoutes from "./routes/romans.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();

// --- Connexion à MongoDB ---
connectDB();

const app = express();

// Sécurité : en-têtes HTTP + Helmet
securityHeaders(app);
app.use(helmet());

// --- Middleware de base ---
app.use(express.json()); // 🔹 indispensable pour lire les JSON (POST/PUT)
app.use(cors());
app.use(morgan("dev"));

// --- Route de test santé ---
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "ok", message: "API AppliPlumeroWeb running" });
});

// --- Routes principales ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/romans", romanRoutes);
app.use("/api/comments", commentRoutes);

// --- Gestion des erreurs ---
app.use(notFoundHandler); // <--- gère les routes inexistantes
app.use(errorHandler);

// --- Lancement du serveur ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

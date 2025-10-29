import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

// --- Imports des routes ---
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import romanRoutes from "./routes/romans.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();

const app = express();

// --- Middleware de base ---
app.use(express.json()); // 🔹 indispensable pour lire les JSON (POST/PUT)
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// --- Connexion à MongoDB ---
connectDB();

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

// Gestion d’erreurs centrale
app.use(errorHandler);

// --- Lancement du serveur ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));

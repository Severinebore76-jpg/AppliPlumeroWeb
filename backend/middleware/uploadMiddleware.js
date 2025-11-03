// ============================================
// 📦 Fichier : uploadMiddleware.js
// ============================================
// Middleware Multer pour la gestion des fichiers
// AppliPlumeroWeb — Phase 1
// ============================================

import multer from "multer";
import path from "path";
import fs from "fs";

// 📁 Répertoire temporaire
const uploadDir = path.join(process.cwd(), "uploads");

// Création du dossier si inexistant
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// 🧩 Filtrage des fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    const err = new Error("Type de fichier non autorisé.");
    err.status = 415;
    return cb(err, false);
  }
  cb(null, true);
};

// 📏 Limite de taille : 5 Mo par fichier
const limits = { fileSize: 5 * 1024 * 1024 };

// 🧠 Export du middleware prêt à l’emploi
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits,
});

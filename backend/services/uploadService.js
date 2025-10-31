import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createError } from "../utils/errorResponse.js";
import { sanitizeFileName, deleteFileSafe } from "../utils/fileHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Répertoires d’upload
const UPLOADS_DIR = path.join(__dirname, "../../uploads");
const AVATARS_DIR = path.join(UPLOADS_DIR, "avatars");
const COVERS_DIR = path.join(UPLOADS_DIR, "covers");

// S’assure que les dossiers existent
[UPLOADS_DIR, AVATARS_DIR, COVERS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/**
 * 🧩 Validation du fichier
 */
const validateFile = (file, type) => {
  if (!file) throw createError(400, "Aucun fichier reçu");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
    throw createError(415, "Format de fichier non supporté");
  }

  const limits = { avatar: 2 * 1024 * 1024, cover: 5 * 1024 * 1024 };
  if (file.size > limits[type]) {
    throw createError(413, `Le fichier dépasse la taille autorisée (${type})`);
  }
};

/**
 * 📤 Upload de fichier
 */
export const uploadFile = async (file, type = "cover") => {
  validateFile(file, type);

  const targetDir = type === "avatar" ? AVATARS_DIR : COVERS_DIR;
  const sanitized = sanitizeFileName(file.originalname);
  const fileName = `${Date.now()}_${sanitized}`;
  const filePath = path.join(targetDir, fileName);

  await fs.promises.writeFile(filePath, file.buffer);

  const publicUrl = `/uploads/${type}/${fileName}`;
  return { fileName, url: publicUrl };
};

/**
 * 🧹 Suppression sécurisée d’un fichier
 */
export const deleteUploadedFile = async (filePath) => {
  try {
    await deleteFileSafe(path.join(UPLOADS_DIR, filePath));
    return { message: "Fichier supprimé avec succès" };
  } catch (err) {
    throw createError(500, `Erreur suppression fichier : ${err.message}`);
  }
};

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createError } from "../utils/errorResponse.js";
import { validateFileType } from "../utils/fileHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

// 📂 Vérifie que le dossier existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * 💾 Sauvegarde un fichier localement
 */
export const saveFile = async (file) => {
  if (!file) throw createError(400, "Aucun fichier fourni");

  // Validation du type MIME
  const isValid = validateFileType(file.mimetype);
  if (!isValid) throw createError(415, "Type de fichier non supporté");

  const filename = `${Date.now()}_${file.originalname}`;
  const destPath = path.join(UPLOADS_DIR, filename);

  await fs.promises.writeFile(destPath, file.buffer);

  return { filename, path: `/uploads/${filename}` };
};

/**
 * 🧹 Supprime un fichier
 */
export const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(UPLOADS_DIR, path.basename(filePath));
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return { deleted: true };
    }
    return { deleted: false, reason: "Fichier non trouvé" };
  } catch (error) {
    throw createError(500, `Erreur lors de la suppression : ${error.message}`);
  }
};

/**
 * 🧭 Liste les fichiers enregistrés
 */
export const listFiles = async () => {
  const files = await fs.promises.readdir(UPLOADS_DIR);
  return files.map((f) => ({
    name: f,
    url: `/uploads/${f}`,
  }));
};

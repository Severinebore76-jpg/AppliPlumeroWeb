// backend/utils/fileHelper.js
import fs from "fs/promises";
import path from "path";

/**
 * Vérifie si un fichier existe
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<boolean>}
 */
export const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Supprime un fichier s’il existe
 * @param {string} filePath - Chemin du fichier à supprimer
 * @returns {Promise<void>}
 */
export const deleteFileIfExists = async (filePath) => {
  if (await fileExists(filePath)) {
    await fs.unlink(filePath);
    console.log(`🗑️ Fichier supprimé : ${filePath}`);
  }
};

/**
 * Crée un fichier et écrit du contenu dedans
 * @param {string} dir - Dossier cible
 * @param {string} filename - Nom du fichier
 * @param {string} content - Contenu à écrire
 */
export const createFile = async (dir, filename, content = "") => {
  const fullPath = path.join(dir, filename);
  await fs.writeFile(fullPath, content, "utf8");
  console.log(`📄 Fichier créé : ${fullPath}`);
  return fullPath;
};

/**
 * Lit le contenu d’un fichier texte
 * @param {string} filePath - Chemin du fichier à lire
 * @returns {Promise<string>}
 */
export const readFileContent = async (filePath) => {
  const data = await fs.readFile(filePath, "utf8");
  return data.trim();
};

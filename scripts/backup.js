/**
 * 🧩 Script de sauvegarde MongoDB — AppliPlumeroWeb
 * Sauvegarde complète de la base sous format .gz horodaté
 */

import { exec } from "child_process";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const BACKUP_DIR = path.resolve("backups");
const DATE = new Date().toISOString().replace(/[:.]/g, "-");
const BACKUP_FILE = `backup-${DATE}.gz`;

// S'assurer que le dossier de sauvegarde existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const CMD = `mongodump --uri="${process.env.MONGO_URI}" --archive=${path.join(
  BACKUP_DIR,
  BACKUP_FILE,
)} --gzip`;

console.log("📦 Lancement de la sauvegarde MongoDB...");

exec(CMD, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Erreur lors de la sauvegarde :", error.message);
    return;
  }
  if (stderr) console.warn("⚠️ Avertissement :", stderr);
  console.log("✅ Sauvegarde terminée :", BACKUP_FILE);
});

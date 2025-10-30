/**
 * 🧹 Script d’automatisation — Nettoyage des logs
 * ------------------------------------------------
 * Supprime les fichiers de logs trop anciens dans /backend/logs/.
 * À exécuter manuellement ou via cron/CI.
 */

import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve("backend/logs");
const MAX_AGE_DAYS = 7; // Supprimer les logs de plus de 7 jours

function cleanupLogs() {
  console.log("🧹 Démarrage du nettoyage des logs...");
  if (!fs.existsSync(LOG_DIR)) {
    console.log("⚠️ Dossier logs introuvable :", LOG_DIR);
    return;
  }

  const files = fs.readdirSync(LOG_DIR);
  const now = Date.now();
  const deletedFiles = [];

  for (const file of files) {
    const filePath = path.join(LOG_DIR, file);
    const stats = fs.statSync(filePath);
    const ageDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

    if (ageDays > MAX_AGE_DAYS) {
      fs.unlinkSync(filePath);
      deletedFiles.push(file);
    }
  }

  if (deletedFiles.length > 0) {
    console.log(`✅ ${deletedFiles.length} fichiers supprimés :`, deletedFiles);
  } else {
    console.log("👌 Aucun log à supprimer.");
  }
  console.log("🧩 Nettoyage terminé.");
}

cleanupLogs();

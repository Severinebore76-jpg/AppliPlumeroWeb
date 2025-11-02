// backend/jobs/cleanupLogs.js
import cron from "cron";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const LOG_DIR = path.resolve("logs");
const RETENTION_DAYS = parseInt(process.env.LOG_RETENTION_DAYS || "30", 10);

// Fonction principale de nettoyage
export const cleanupLogs = () => {
  logger.info("🧹 Démarrage du nettoyage des logs...");

  try {
    if (!fs.existsSync(LOG_DIR)) {
      logger.warn("⚠️ Dossier de logs inexistant, rien à nettoyer.");
      return;
    }

    const files = fs.readdirSync(LOG_DIR);
    const now = Date.now();
    const deleted = [];

    for (const file of files) {
      const filePath = path.join(LOG_DIR, file);
      const stats = fs.statSync(filePath);
      const ageDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

      if (ageDays > RETENTION_DAYS) {
        fs.unlinkSync(filePath);
        deleted.push(file);
      }
    }

    if (deleted.length > 0) {
      logger.info(
        `✅ ${deleted.length} fichier(s) supprimé(s) : ${deleted.join(", ")}`,
      );
    } else {
      logger.info("✅ Aucun fichier à supprimer, les logs sont à jour.");
    }
  } catch (err) {
    logger.error(`❌ Erreur lors du nettoyage des logs : ${err.message}`);
  }
};

// Planification quotidienne à 04h00
const job = new cron.CronJob(
  "0 4 * * *",
  cleanupLogs,
  null,
  true,
  "Europe/Paris",
);
logger.info("⏰ Job cleanupLogs programmé à 04h00 (Europe/Paris)");

export default job;

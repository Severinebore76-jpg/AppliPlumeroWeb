// backend/jobs/backupJob.js
import cron from "cron";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

// 🔹 Répertoire de sauvegarde local
const BACKUP_DIR = path.resolve("backups");
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// 🔹 Commande mongodump
const mongoUri = process.env.MONGO_URI;
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.gz`);
const dumpCommand = `mongodump --uri="${mongoUri}" --archive=${backupFile} --gzip`;

export const runBackup = () => {
  logger.info("🗂️ Démarrage du job de sauvegarde MongoDB...");

  exec(dumpCommand, (error, stdout, stderr) => {
    if (error) {
      logger.error(`❌ Erreur de sauvegarde : ${error.message}`);
      return;
    }
    if (stderr) logger.warn(`⚠️ Avertissement : ${stderr}`);
    logger.info(`✅ Sauvegarde terminée avec succès → ${backupFile}`);
  });
};

// 🔹 Tâche planifiée : tous les jours à 3h du matin
const job = new cron.CronJob(
  "0 3 * * *",
  runBackup,
  null,
  true,
  "Europe/Paris",
);

logger.info("⏰ Job backup programmé à 3h00 (Europe/Paris)");
export default job;

// backend/jobs/notificationJob.js
import cron from "cron";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { createNotificationBatch } from "../services/notificationService.js";

dotenv.config();

// Fonction principale : création et envoi de notifications
export const runNotificationJob = async () => {
  logger.info("🔔 Démarrage du job de notifications...");

  try {
    const created = await createNotificationBatch();

    if (created > 0) {
      logger.info(`✅ ${created} notification(s) générée(s) avec succès.`);
    } else {
      logger.info("ℹ️ Aucune nouvelle notification à générer.");
    }
  } catch (err) {
    logger.error(
      `❌ Erreur lors de l’exécution du job notification: ${err.message}`,
    );
  }
};

// Planification : toutes les heures par défaut
const schedule = process.env.CRON_NOTIFY_SCHEDULE || "0 * * * *"; // chaque heure pile
const job = new cron.CronJob(
  schedule,
  runNotificationJob,
  null,
  true,
  "Europe/Paris",
);

logger.info(
  `⏰ Job notificationJob planifié (${schedule}) — fuseau Europe/Paris`,
);

export default job;

// backend/jobs/emailDigestJob.js
import cron from "cron";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
import { sendDigestEmail } from "../services/emailService.js";
import { getRecentRomans } from "../services/romanService.js";
import { getGlobalNotifications } from "../services/notificationService.js";
import User from "../models/User.js";

dotenv.config();

// Fonction principale d'envoi du digest
export const runEmailDigest = async () => {
  logger.info("💌 Démarrage du job hebdomadaire — Email Digest");

  try {
    const [romans, notifications, users] = await Promise.all([
      getRecentRomans(7), // romans publiés dans les 7 derniers jours
      getGlobalNotifications(7),
      User.find({ isVerified: true }, "email name"),
    ]);

    if (!romans.length && !notifications.length) {
      logger.info("ℹ️ Aucun nouveau contenu, envoi du digest annulé.");
      return;
    }

    for (const user of users) {
      try {
        await sendDigestEmail(user.email, {
          name: user.name,
          romans,
          notifications,
        });
        logger.info(`📨 Digest envoyé à ${user.email}`);
      } catch (emailErr) {
        logger.error(
          `❌ Échec envoi digest à ${user.email}: ${emailErr.message}`,
        );
      }
    }

    logger.info("✅ Envoi du digest terminé avec succès.");
  } catch (err) {
    logger.error(`❌ Erreur dans emailDigestJob: ${err.message}`);
  }
};

// Planification hebdomadaire : tous les lundis à 09h00
const job = new cron.CronJob(
  "0 9 * * 1",
  runEmailDigest,
  null,
  true,
  "Europe/Paris",
);
logger.info(
  "⏰ Job emailDigestJob programmé : chaque lundi à 09h00 (Europe/Paris)",
);

export default job;

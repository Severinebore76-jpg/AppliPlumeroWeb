// backend/jobs/subscriptionCheckJob.js
// 🔹 Vérifie périodiquement l’état des abonnements utilisateurs (expiration, synchronisation Stripe)

import cron from "node-cron";
import dotenv from "dotenv";
import { checkAndUpdateSubscriptions } from "../services/subscriptionService.js";
import logger from "../utils/logger.js";

dotenv.config();

/**
 * Tâche planifiée : vérifie tous les jours à minuit les abonnements actifs.
 * - Synchronise les statuts Stripe avec MongoDB
 * - Désactive ceux expirés
 * - Envoie les notifications et e-mails de renouvellement/expiration
 */
export const startSubscriptionCheckJob = () => {
  const schedule = process.env.CRON_SUBSCRIPTION_SCHEDULE || "0 0 * * *"; // minuit par défaut

  logger.info(
    `🕓 Initialisation du job d’abonnements (planifié : ${schedule})...`,
  );

  cron.schedule(schedule, async () => {
    logger.info("🔄 Début de la vérification quotidienne des abonnements...");

    try {
      const result = await checkAndUpdateSubscriptions();
      logger.info(
        `✅ Job terminé — Abonnements mis à jour : ${result.updatedCount}`,
      );
    } catch (error) {
      logger.error(
        `❌ Erreur lors de la vérification des abonnements : ${error.message}`,
      );
    }
  });
};

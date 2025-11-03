// ============================================
// 📄 Fichier : activityLogger.js
// ============================================
// Middleware de suivi des activités utilisateur
// AppliPlumeroWeb — Phase 1
// ============================================

import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "logs", "activity.log");

// Fonction utilitaire d'écriture
const writeLog = async (entry) => {
  const line = `[${new Date().toISOString()}] ${entry}\n`;
  fs.promises
    .appendFile(logFile, line)
    .catch((err) =>
      console.error("Erreur lors de l’écriture du log d’activité :", err),
    );
};

// Middleware principal
export const activityLogger = async (req, res, next) => {
  res.on("finish", () => {
    // Ne logue pas les requêtes statiques ni les assets
    if (req.originalUrl.startsWith("/assets")) return;

    const user = req.user ? req.user.email || req.user.id : "Anonyme";
    const method = req.method;
    const status = res.statusCode;
    const route = req.originalUrl;
    const action = `${method} ${route} → ${status}`;
    const logEntry = `User: ${user} | Action: ${action} | IP: ${req.ip}`;

    writeLog(logEntry);
  });

  next();
};

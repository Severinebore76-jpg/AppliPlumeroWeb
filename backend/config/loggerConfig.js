/**
 * 🧾 Configuration du logger — AppliPlumeroWeb
 * --------------------------------------------
 * Centralise la gestion des logs via Winston :
 *  - Format JSON pour la production
 *  - Format coloré pour le développement
 *  - Double sortie : console + fichiers
 */

import winston from "winston";
import path from "path";
import fs from "fs";

// Vérifie et crée le dossier logs s’il n’existe pas
const logsDir = path.resolve("backend/logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Format personnalisé
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()} : ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
    }),
  ],
});

export default logger;

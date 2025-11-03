// ============================================
// 🧾 Fichier : requestLogger.js
// ============================================
// Middleware de journalisation des requêtes HTTP
// AppliPlumeroWeb — Phase 1
// ============================================

import chalk from "chalk";

// Middleware Express pour journaliser les requêtes entrantes
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const method = chalk.cyan(req.method);
    const statusColor =
      res.statusCode >= 500
        ? chalk.red
        : res.statusCode >= 400
          ? chalk.yellow
          : chalk.green;
    const status = statusColor(res.statusCode);
    const url = chalk.white(req.originalUrl);
    const time = chalk.gray(`${duration}ms`);

    console.log(
      `${method} ${url} → ${status} ${time} [from ${req.ip || "unknown"}]`,
    );
  });

  next();
};

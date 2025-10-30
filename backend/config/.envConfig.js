/**
 * ⚙️ Configuration environnement — AppliPlumeroWeb
 * -------------------------------------------------
 * Centralise la lecture, la validation et l’export des variables d’environnement.
 */

import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT"];

const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(
    `❌ Variables d'environnement manquantes : ${missingVars.join(", ")}`,
  );
  process.exit(1);
}

export const envConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8080,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: process.env.SMTP_PORT || 587,
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  emailFrom: process.env.EMAIL_FROM || "AppliPlumeroWeb <no-reply@plumero.com>",
  logLevel: process.env.LOG_LEVEL || "info",
};

console.log(`✅ Configuration chargée (${envConfig.nodeEnv})`);

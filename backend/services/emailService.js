// backend/services/emailService.js
import nodemailer from "nodemailer";
import { createError } from "../utils/errorResponse.js";
import { logger } from "../utils/logger.js";

/**
 * 🔹 Configuration du transporteur SMTP
 * Fonctionne avec Gmail, Mailtrap ou un SMTP professionnel.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // true si port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * 🔸 Envoi générique d’un e-mail
 * @param {string} to - Adresse destinataire
 * @param {string} subject - Sujet du mail
 * @param {string} html - Contenu HTML
 * @param {string} text - Version texte (optionnelle)
 */
export const sendMail = async (to, subject, html, text = "") => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Plumero" <${process.env.SMTP_SENDER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email envoyé à ${to} (${subject})`);
    return info;
  } catch (error) {
    logger.error("❌ Erreur d’envoi d’email :", error.message);
    throw createError(500, "Erreur lors de l’envoi d’email", error.message);
  }
};

/**
 * 📩 Email de vérification de compte utilisateur
 * @param {object} user - Objet utilisateur (nom + email)
 * @param {string} token - Jeton de vérification
 */
export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  const html = `
    <h2>Bienvenue sur Plumero, ${user.name} 🌙</h2>
    <p>Merci de vous être inscrit. Cliquez ci-dessous pour vérifier votre compte :</p>
    <a href="${verifyUrl}" target="_blank" style="background:#6C63FF;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Vérifier mon compte</a>
    <p style="color:#888;">Ce lien expirera dans 24 heures.</p>
  `;

  return sendMail(user.email, "Vérification de votre compte Plumero", html);
};

/**
 * 🔁 Email de réinitialisation de mot de passe
 * @param {object} user - Utilisateur concerné
 * @param {string} token - Jeton de réinitialisation
 */
export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <h2>Réinitialisation de mot de passe 🔒</h2>
    <p>Bonjour ${user.name},</p>
    <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
    <a href="${resetUrl}" target="_blank" style="background:#FF8C00;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Réinitialiser mon mot de passe</a>
    <p style="color:#888;">Ce lien est valide pendant 1 heure.</p>
  `;

  return sendMail(user.email, "Réinitialisation de votre mot de passe", html);
};

/**
 * 💳 Email de confirmation de paiement ou d’abonnement
 * @param {object} user - Utilisateur ayant effectué le paiement
 * @param {string} amount - Montant du paiement
 * @param {string} plan - Type d’abonnement (mensuel, annuel, premium…)
 */
export const sendPaymentConfirmationEmail = async (user, amount, plan) => {
  const html = `
    <h2>Merci ${user.name} 💎</h2>
    <p>Votre paiement de <strong>${amount} €</strong> pour le plan <em>${plan}</em> a bien été confirmé.</p>
    <p>Vous pouvez désormais profiter pleinement de votre accès Premium sans limite.</p>
    <p style="color:#777;">— L’équipe Plumero</p>
  `;

  return sendMail(user.email, "Confirmation de paiement Plumero", html);
};

/**
 * 🧪 Test manuel de la configuration SMTP
 */
export const sendTestEmail = async () => {
  return sendMail(
    process.env.SMTP_USER,
    "✅ Test SMTP — AppliPlumeroWeb",
    "<p>Connexion SMTP et service d’e-mail fonctionnels.</p>",
  );
};

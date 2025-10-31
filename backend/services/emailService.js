import nodemailer from "nodemailer";
import { createError } from "../utils/errorResponse.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // true pour port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * 🔹 Envoi d’un email générique
 */
export const sendMail = async (to, subject, html, text = "") => {
  try {
    const info = await transporter.sendMail({
      from: `"Plumero" <${process.env.SMTP_SENDER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`📨 Email envoyé à ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Erreur d’envoi d’email :", error.message);
    throw createError(500, "Erreur lors de l’envoi d’email", error.message);
  }
};

/**
 * 📧 Email de vérification de compte
 */
export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  const html = `
    <h2>Bienvenue sur Plumero, ${user.name} 🌙</h2>
    <p>Merci de vous être inscrit. Cliquez ci-dessous pour vérifier votre compte :</p>
    <a href="${verifyUrl}" target="_blank">Vérifier mon compte</a>
    <p>Ce lien expire dans 24 heures.</p>
  `;

  return sendMail(user.email, "Vérification de votre compte Plumero", html);
};

/**
 * 🔁 Email de réinitialisation de mot de passe
 */
export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <h2>Réinitialisation de mot de passe 🔒</h2>
    <p>Bonjour ${user.name}, cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
    <a href="${resetUrl}" target="_blank">Réinitialiser mon mot de passe</a>
    <p>Ce lien est valide pendant 1 heure.</p>
  `;

  return sendMail(user.email, "Réinitialisation de votre mot de passe", html);
};

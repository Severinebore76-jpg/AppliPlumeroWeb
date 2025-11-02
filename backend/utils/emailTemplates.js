// backend/utils/emailTemplates.js

/**
 * Génère le contenu HTML d’un e-mail de bienvenue
 */
export const welcomeEmail = (name) => ({
  subject: "Bienvenue sur AppliPlumeroWeb ✨",
  html: `
    <h2>Bonjour ${name},</h2>
    <p>Bienvenue dans la communauté <strong>AppliPlumeroWeb</strong> !</p>
    <p>Commencez dès maintenant à découvrir, lire et publier vos œuvres préférées.</p>
    <p style="color:#777;">L’équipe AppliPlumeroWeb</p>
  `,
});

/**
 * Génère le contenu HTML d’un e-mail de réinitialisation de mot de passe
 */
export const resetPasswordEmail = (name, resetLink) => ({
  subject: "Réinitialisation de votre mot de passe 🔒",
  html: `
    <h2>Bonjour ${name},</h2>
    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
    <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
    <a href="${resetLink}" style="color:#0066cc;">Réinitialiser mon mot de passe</a>
    <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</p>
    <p style="color:#777;">L’équipe AppliPlumeroWeb</p>
  `,
});

/**
 * Génère le contenu HTML d’un e-mail de confirmation de paiement
 */
export const paymentConfirmationEmail = (name, amount) => ({
  subject: "Paiement confirmé 💳",
  html: `
    <h2>Merci ${name} !</h2>
    <p>Votre paiement de <strong>${amount} €</strong> a bien été reçu.</p>
    <p>Vous avez désormais accès à votre contenu premium.</p>
    <p style="color:#777;">L’équipe AppliPlumeroWeb</p>
  `,
});

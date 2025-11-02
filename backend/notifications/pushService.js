// backend/notifications/pushService.js
import webpush from "web-push";

// 🔹 Clés VAPID stockées en variables d'environnement
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:support@plumero.com";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// 🔹 Envoi d’une notification push à un abonné
export const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur envoi push:", error.message);
    return { success: false, error: error.message };
  }
};

// 🔹 Vérifie la validité d’un abonnement
export const validateSubscription = (subscription) => {
  return (
    subscription &&
    typeof subscription.endpoint === "string" &&
    subscription.keys &&
    typeof subscription.keys.p256dh === "string" &&
    typeof subscription.keys.auth === "string"
  );
};

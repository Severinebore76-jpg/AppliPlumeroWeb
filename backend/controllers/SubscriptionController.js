import {
  createSubscription,
  listSubscriptions,
  cancelSubscription,
} from "../services/subscriptionService.js";
import { createError } from "../utils/errorResponse.js";

// ➕ Créer un abonnement
export const subscribe = async (req, res, next) => {
  try {
    const { targetId, type } = req.body;
    if (!targetId || !type)
      throw createError(400, "Données incomplètes pour créer un abonnement");

    const subscription = await createSubscription(req.user._id, targetId, type);
    res.status(201).json({ success: true, subscription });
  } catch (err) {
    next(err);
  }
};

// 📋 Lister les abonnements actifs de l’utilisateur
export const list = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const subscriptions = await listSubscriptions(req.user._id, page, limit);
    res.status(200).json({ success: true, page, limit, subscriptions });
  } catch (err) {
    next(err);
  }
};

// ❌ Se désabonner
export const unsubscribe = async (req, res, next) => {
  try {
    const unsubscribed = await cancelSubscription(req.params.id, req.user._id);
    if (!unsubscribed)
      throw createError(404, "Abonnement introuvable ou non autorisé");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

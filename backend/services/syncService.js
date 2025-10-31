import SyncData from "../models/SyncData.js";
import ReadingProgress from "../models/ReadingProgress.js";
import BookStats from "../models/BookStats.js";
import { createError } from "../utils/errorResponse.js";

/**
 * 🔄 Envoie les données locales à synchroniser
 */
export const uploadSyncData = async (userId, clientData) => {
  if (!clientData || !Array.isArray(clientData)) {
    throw createError(400, "Format de données invalide");
  }

  const syncResults = [];

  for (const item of clientData) {
    const { type, data, updatedAt } = item;

    switch (type) {
      case "readingProgress":
        await ReadingProgress.findOneAndUpdate(
          { user: userId, roman: data.roman },
          { ...data, updatedAt },
          { upsert: true, new: true },
        );
        break;

      case "bookStats":
        await BookStats.findOneAndUpdate(
          { user: userId, roman: data.roman },
          { ...data, updatedAt },
          { upsert: true, new: true },
        );
        break;

      default:
        throw createError(400, `Type de synchronisation inconnu: ${type}`);
    }

    syncResults.push({ type, status: "synced" });
  }

  await SyncData.create({
    user: userId,
    data: clientData,
    direction: "upload",
  });

  return { message: "Synchronisation effectuée", results: syncResults };
};

/**
 * 📥 Télécharge les données récentes depuis le serveur
 */
export const downloadSyncData = async (userId, lastSyncDate) => {
  const query = lastSyncDate
    ? { updatedAt: { $gt: new Date(lastSyncDate) } }
    : {};

  const [progress, stats] = await Promise.all([
    ReadingProgress.find({ user: userId, ...query }).lean(),
    BookStats.find({ user: userId, ...query }).lean(),
  ]);

  await SyncData.create({
    user: userId,
    data: [...progress, ...stats],
    direction: "download",
  });

  return { progress, stats, lastSync: new Date() };
};

/**
 * 🧭 Récupère l’historique de synchronisation
 */
export const getSyncHistory = async (userId, limit = 20) => {
  const history = await SyncData.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return history;
};

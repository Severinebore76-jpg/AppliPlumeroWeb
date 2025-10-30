/**
 * 🩺 Healthcheck — Vérification du statut de l'API et de la base MongoDB
 * ------------------------------------------------------------
 * Permet de tester la disponibilité du serveur et la connexion à la base de données.
 */

import mongoose from "mongoose";

export const healthCheck = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = ["déconnecté", "connecté", "connectant", "déconnectant"];
    const status = {
      server: "🟢 OK",
      database: states[dbState] || "inconnu",
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({
      server: "🔴 DOWN",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

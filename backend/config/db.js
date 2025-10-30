/**
 * 🗄️ Connexion MongoDB — AppliPlumeroWeb
 * --------------------------------------
 * Gère la connexion à MongoDB via Mongoose.
 * Récupère l'URI depuis le fichier .env (MONGO_URI).
 * Arrête le processus en cas d'échec critique.
 */

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🟢 MongoDB connecté : ${conn.connection.host}`);

    // 🔹 Gestion des événements de connexion
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB déconnecté");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔁 MongoDB reconnecté");
    });
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

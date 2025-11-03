// ============================================
// 🗄️ Fichier : backend/config/db.js
// ============================================
// Gère la connexion à MongoDB via Mongoose.
// Utilise la variable MONGO_URI du .env.
// ============================================

import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  console.log("🔍 Connexion MongoDB →", mongoURI || "❌ URI manquante");

  if (!mongoURI || typeof mongoURI !== "string") {
    console.error("❌ Erreur critique : MONGO_URI introuvable ou invalide.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);

    console.log(`🟢 MongoDB connecté : ${conn.connection.host}`);

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

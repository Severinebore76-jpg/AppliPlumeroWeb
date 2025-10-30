/**
 * 🌱 Script de seed — AppliPlumeroWeb
 * -------------------------------------------
 * Remplit la base MongoDB avec des données de test :
 * - utilisateurs
 * - romans
 * - commentaires
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../backend/models/userModel.js";
import { Roman } from "../backend/models/romanModel.js";
import { Comment } from "../backend/models/commentModel.js";
import users from "../backend/mock/users.js";
import romans from "../backend/mock/romans.js";
import comments from "../backend/mock/comments.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/appliplumeroweb";

(async () => {
  try {
    console.log("🌿 Connexion à MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    console.log("🧹 Nettoyage des collections...");
    await Promise.all([
      User.deleteMany({}),
      Roman.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    console.log("🌱 Insertion des données fictives...");
    const createdUsers = await User.insertMany(users);
    const createdRomans = await Roman.insertMany(romans);
    const createdComments = await Comment.insertMany(comments);

    console.log(`👥 Utilisateurs : ${createdUsers.length}`);
    console.log(`📚 Romans : ${createdRomans.length}`);
    console.log(`💬 Commentaires : ${createdComments.length}`);

    console.log("🎉 Seed terminé avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
    process.exit(1);
  }
})();

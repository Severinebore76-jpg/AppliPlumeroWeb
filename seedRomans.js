/**
 * 🌱 Script de peuplement initial — seedRomans.js
 * Injecte des romans fictifs dans MongoDB pour le développement.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Roman from "./backend/models/Roman.js";
import connectDB from "./backend/config/db.js";

dotenv.config();

// Données fictives
const romans = [
  {
    titre: "Le Carnet Oublié",
    auteur: "Mya Syde",
    genre: "Drame psychologique",
    description:
      "Une femme retrouve un carnet d’adolescente qui réveille les fantômes du passé.",
    langue: "fr",
    statut: "publié",
    datePublication: new Date("2023-05-12"),
  },
  {
    titre: "La Route des Silences",
    auteur: "Mya Syde",
    genre: "Fiction introspective",
    description:
      "Un voyage initiatique entre le poids des souvenirs et la quête de rédemption.",
    langue: "fr",
    statut: "publié",
    datePublication: new Date("2024-02-01"),
  },
  {
    titre: "Entre les Lignes",
    auteur: "Mya Syde",
    genre: "Romance contemporaine",
    description:
      "Deux âmes se retrouvent dans une correspondance virtuelle qui dépasse la fiction.",
    langue: "fr",
    statut: "brouillon",
    datePublication: new Date("2025-01-10"),
  },
];

// Fonction principale
const seedRomans = async () => {
  try {
    await connectDB();

    console.log("🧹 Suppression des anciens romans...");
    await Roman.deleteMany();

    console.log("🌱 Insertion des nouveaux romans...");
    await Roman.insertMany(romans);

    console.log("✅ Données insérées avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
    process.exit(1);
  }
};

seedRomans();

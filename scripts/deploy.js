/**
 * 🚀 Script de déploiement automatique — AppliPlumeroWeb
 * -------------------------------------------
 * Étapes :
 * 1. Build du frontend
 * 2. Vérification du backend
 * 3. Commit & push GitHub
 * 4. Déploiement Render / Railway / Heroku
 */

import { execSync } from "child_process";
import fs from "fs";

const run = (cmd, desc) => {
  console.log(`\n▶️  ${desc}...`);
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`✅  ${desc} terminé`);
  } catch (err) {
    console.error(`❌ Erreur lors de : ${desc}`);
    process.exit(1);
  }
};

// Vérification présence de dossier frontend
if (!fs.existsSync("frontend")) {
  console.error("❌ Dossier frontend introuvable. Vérifie ta structure.");
  process.exit(1);
}

// Étape 1 : Build du frontend
run("cd frontend && npm run build", "Build du frontend");

// Étape 2 : Copie du build vers le backend/public
run(
  "cp -r frontend/dist/* backend/public/",
  "Copie des fichiers frontend vers backend/public",
);

// Étape 3 : Commit et push GitHub
run(
  'git add . && git commit -m "🚀 Déploiement auto" && git push origin main',
  "Commit & push GitHub",
);

// Étape 4 : Déploiement sur Render/Railway/Heroku
console.log("\n🚀 Déploiement terminé !");
console.log("📦 Vérifie ton pipeline sur Render / Railway / Heroku.");

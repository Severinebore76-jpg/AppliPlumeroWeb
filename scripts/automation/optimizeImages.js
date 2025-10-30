/**
 * 🖼️ Script d’automatisation — Optimisation des images
 * -----------------------------------------------------
 * Compresse automatiquement les images (PNG, JPG, JPEG, WEBP)
 * présentes dans /frontend/public et /frontend/src/assets/.
 */

import fs from "fs";
import path from "path";
import imagemin from "imagemin";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminWebp from "imagemin-webp";

const IMAGE_DIRS = [
  path.resolve("frontend/public"),
  path.resolve("frontend/src/assets"),
];

async function optimizeImages() {
  console.log("🖼️ Démarrage de l’optimisation des images...");

  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️ Dossier introuvable : ${dir}`);
      continue;
    }

    console.log(`📂 Traitement du dossier : ${dir}`);

    const files = fs.readdirSync(dir);
    const imageFiles = files.filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

    for (const file of imageFiles) {
      const filePath = path.join(dir, file);
      const buffer = fs.readFileSync(filePath);

      const optimized = await imagemin.buffer(buffer, {
        plugins: [
          imageminMozjpeg({ quality: 75 }),
          imageminPngquant({ quality: [0.6, 0.8] }),
          imageminWebp({ quality: 80 }),
        ],
      });

      fs.writeFileSync(filePath, optimized);
      console.log(`✅ Optimisé : ${file}`);
    }
  }

  console.log("🎉 Optimisation terminée !");
}

optimizeImages().catch((err) => {
  console.error("❌ Erreur pendant l’optimisation :", err);
});

/**
 * 🌍 Script d’automatisation — Génération du sitemap
 * --------------------------------------------------
 * Met automatiquement à jour /public/sitemap.xml
 * en fonction des routes principales de l’application.
 */

import fs from "fs";
import path from "path";

const BASE_URL = "https://plumero.com"; // à modifier si domaine différent

const ROUTES = [
  "/",
  "/romans",
  "/auteurs",
  "/categories",
  "/abonnements",
  "/connexion",
  "/inscription",
  "/profil",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
];

const sitemapPath = path.resolve("public/sitemap.xml");

function generateSitemap() {
  console.log("🌍 Génération du sitemap...");

  const urls = ROUTES.map((route) => {
    return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`;
  }).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(sitemapPath, sitemap.trim());
  console.log(`✅ Sitemap mis à jour : ${sitemapPath}`);
}

generateSitemap();

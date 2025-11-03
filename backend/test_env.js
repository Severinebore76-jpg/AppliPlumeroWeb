import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// forcer lecture du .env racine
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath, override: true });

console.log("🔍 Chemin du .env testé :", envPath);
console.log("🔍 STRIPE_SECRET_KEY =", process.env.STRIPE_SECRET_KEY);
console.log(
  "🔍 Toutes les variables lues :",
  Object.keys(process.env).filter((k) => k.includes("STRIPE")),
);

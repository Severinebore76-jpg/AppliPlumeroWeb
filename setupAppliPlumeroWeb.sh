#!/bin/bash
set -e

echo "==============================================="
echo "🚀 Installation complète du projet AppliPlumeroWeb"
echo "==============================================="

# ----------------------------
# Étape 1 — Création du projet racine
# ----------------------------
cd ~/Desktop/formation_codage/ || exit
rm -rf AppliPlumeroWeb
mkdir -p AppliPlumeroWeb
cd AppliPlumeroWeb || exit

echo "📁 Création de la structure principale..."
git init -q

# ----------------------------
# Étape 2 — FRONTEND : React + Vite
# ----------------------------
echo "⚙️ Installation du frontend (React + Vite)..."
yes | npm create vite@latest frontend -- --template react
cd frontend || exit
npm install -q
npm install eslint --save-dev -q
cd ..

echo "✅ Frontend initialisé."

# ----------------------------
# Étape 3 — BACKEND : Node + Express + MongoDB
# ----------------------------
echo "⚙️ Installation du backend..."
mkdir backend && cd backend
npm init -y -q

npm install express mongoose dotenv cors morgan winston bcrypt jsonwebtoken nodemailer stripe swagger-ui-express joi helmet compression rate-limiter-flexible cron -q
npm install --save-dev nodemon jest supertest -q

mkdir -p config controllers middleware models services routes utils constants jobs mock notifications docs scripts tests/integration content/romans logs

# index.js
cat > index.js <<'EOL'
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

connectDB();

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API AppliPlumeroWeb running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
EOL

# config/db.js
mkdir -p config
cat > config/db.js <<'EOL'
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🟢 MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
EOL

# middleware/errorHandler.js
mkdir -p middleware
cat > middleware/errorHandler.js <<'EOL'
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Erreur serveur interne" });
};
EOL

cd ..

echo "✅ Backend configuré."

# ----------------------------
# Étape 4 — STRUCTURE FRONTEND
# ----------------------------
echo "📁 Création des sous-dossiers frontend..."

cd frontend/src || exit
mkdir -p api assets/{icons,images,thumbnails,fonts} components/{Header,Footer,Reader,UI} constants config context docs hooks locales pages routes seo store styles types utils tests

# App.jsx
cat > App.jsx <<'EOL'
import { useState } from "react";
import "./styles/theme.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <main className="container">
        <h1>Bienvenue sur AppliPlumeroWeb 📚</h1>
        <p>Votre univers littéraire en ligne.</p>
        <button onClick={() => setCount(count + 1)}>
          Vous avez cliqué {count} fois
        </button>
      </main>
      <Footer />
    </>
  );
}

export default App;
EOL

mkdir -p components/Header components/Footer config styles

# Header.jsx
cat > components/Header/Header.jsx <<'EOL'
const Header = () => {
  return (
    <header className="header">
      <h2>AppliPlumeroWeb</h2>
      <nav>
        <a href="/">Accueil</a> | <a href="/romans">Romans</a> | <a href="/profil">Profil</a>
      </nav>
    </header>
  );
};
export default Header;
EOL

# Footer.jsx
cat > components/Footer/Footer.jsx <<'EOL'
const Footer = () => (
  <footer className="footer">
    <p>© 2025 AppliPlumeroWeb. Tous droits réservés.</p>
  </footer>
);
export default Footer;
EOL

# themeConfig.js
cat > config/themeConfig.js <<'EOL'
export const theme = {
  colors: {
    primary: "#a67c52",
    secondary: "#f5f2ea",
    accent: "#e1c699",
    text: "#333333",
  },
  font: "Inter, sans-serif",
};
EOL

# theme.css
cat > styles/theme.css <<'EOL'
body {
  font-family: "Inter", sans-serif;
  background-color: #f5f2ea;
  margin: 0;
  padding: 0;
  color: #333;
}
header, footer {
  background-color: #a67c52;
  color: white;
  text-align: center;
  padding: 1rem;
}
main {
  padding: 2rem;
  text-align: center;
}
button {
  background: #a67c52;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #8a653d;
}
EOL

cd ../../..

echo "✅ Frontend complet structuré."

# ----------------------------
# Étape 5 — Fichiers racine
# ----------------------------
echo "🧾 Création des fichiers racine..."
touch Dockerfile .dockerignore README_DEPLOY.md CHANGELOG.md SECURITY.md LICENSE.md .Procfile
mkdir -p docs scripts public .github/workflows

cat > .env.example <<EOL
MONGO_URI=mongodb://localhost:27017/appliplumeroweb
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_key_here
EOL

echo "web: node backend/index.js" > .Procfile

# Dockerfile
cat > Dockerfile <<'EOL'
FROM node:20 AS build-frontend
WORKDIR /app/frontend
COPY frontend/ .
RUN npm install && npm run build

FROM node:20
WORKDIR /app
COPY backend/ ./backend
COPY --from=build-frontend /app/frontend/dist ./backend/public
WORKDIR /app/backend
RUN npm install --production
EXPOSE 8080
CMD ["node", "index.js"]
EOL

# Workflow GitHub
cat > .github/workflows/deploy.yml <<'EOL'
name: Deploy AppliPlumeroWeb
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Build & Install
        run: |
          cd frontend && npm ci && npm run build
          cd ../backend && npm ci
EOL

mkdir -p public
touch public/favicon.ico public/apple-touch-icon.png public/manifest.json public/robots.txt public/sitemap.xml public/icon.svg

# ----------------------------
# Étape 6 — .gitignore
# ----------------------------
npx gitignore node

# ----------------------------
# Étape 7 — Fin
# ----------------------------
echo "✅ Projet AppliPlumeroWeb prêt !"
echo "----------------------------------------"
echo "👉 Étapes suivantes :"
echo "1️⃣ cd AppliPlumeroWeb/backend && npm run dev  → Lancer le serveur API"
echo "2️⃣ cd AppliPlumeroWeb/frontend && npm run dev → Lancer l'interface web"
echo "3️⃣ Copier .env.example en .env et renseigner les clés"
echo "----------------------------------------"
echo "🎉 Tout est prêt. Bon dev !"
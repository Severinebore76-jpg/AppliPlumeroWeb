# 🚀 Guide de Déploiement — AppliPlumeroWeb

## 🎯 Objectif

Ce document décrit les différentes procédures de **déploiement**, **mise à jour** et **maintenance** de l’application **AppliPlumeroWeb**, que ce soit en environnement local, Docker, ou cloud.

---

## 🧩 1. Environnement de déploiement

### 🧱 Prérequis

- Node.js **v20+**
- Docker & Docker Compose installés
- Compte **MongoDB Atlas** (ou conteneur Mongo local)
- Accès au dépôt GitHub :  
  `https://github.com/Severinebore76-jpg/AppliPlumeroWeb`

---

## ⚙️ 2. Déploiement local avec Docker Compose

### 🔹 Étapes

```bash
# 1️⃣ Construction des images
docker-compose build

# 2️⃣ Lancement des conteneurs
docker-compose up -d

# 3️⃣ Vérification du statut
docker ps

💡 Le backend sera accessible sur http://localhost:8080
La base MongoDB tournera sur mongodb://localhost:27017

⸻

🗂️ 3. Variables d’environnement

Les variables sensibles sont définies dans .env (ou .env.production pour le cloud).
Exemple minimal :

NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://<USER_ATLAS>:<PASSWORD>@<CLUSTER>.mongodb.net/appliplumeroweb
JWT_SECRET=supersecretkey
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx

⚠️ Ces fichiers ne doivent jamais être commités sur GitHub.

⸻

☁️ 4. Déploiement sur Render / Railway / Heroku

🔸 Étapes communes
1. Créer un nouveau projet relié à ton repo GitHub.
2. Configurer la variable PORT → 8080.
3. Ajouter toutes les variables d’environnement listées ci-dessus.
4. Activer le déploiement automatique sur la branche main.
5. (Optionnel) Ajouter un job de build :

npm ci --omit=dev && npm run build

🧭 5. Supervision & logs

🔍 Logs backend

Les logs sont stockés dans backend/logs/ :
• combined.log → activité complète
• error.log → erreurs serveur
• debug.log → logs détaillés de développement

🔁 Nettoyage automatique

Exécuter périodiquement :

node scripts/automation/cleanupLogs.js

🔒 6. Sécurité & maintenance

Élément
Vérification
Fréquence
🔐 Mises à jour dépendances (npm audit)
Sécurité NPM
Mensuel
🧱 Sauvegarde MongoDB (script backup.js)
Données persistantes
Hebdomadaire
⚙️ Optimisation images (optimizeImages.js)
Contenu statique
Mensuel
🌐 Mise à jour sitemap (updateSitemap.js)
SEO dynamique
Mensuel

🧩 7. Déploiement en production (Docker + GitHub Actions)

Workflow automatique (.github/workflows/deploy.yml)

name: Deploy to Production
on:
  push:
    branches: [ "main" ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t appliplumeroweb .
      - name: Run container
        run: docker-compose up -d

✅ 8. Tests post-déploiement

1. Vérifier le statut du serveur :

curl http://localhost:8080/health

→ Doit renvoyer { "status": "OK" }.

2. Contrôler les logs Docker :

docker logs appliplumeroweb_backend

3. Vérifier la connexion à MongoDB :

docker exec -it appliplumeroweb_db mongosh
show dbs

🧠 9. Bonnes pratiques de déploiement

• Toujours taguer tes versions (git tag v1.0.0) avant un déploiement.
• Ne jamais exposer les clés ou tokens en clair.
• Documenter chaque incident ou rollback dans le CHANGELOG.md.
• Tester en environnement de staging avant chaque release publique.

⸻

© 2025 – AppliPlumeroWeb | Document interne – Ne pas diffuser publiquement
```

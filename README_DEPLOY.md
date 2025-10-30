# 🚀 Déploiement — AppliPlumeroWeb

## 📦 Prérequis

- Node.js 20+
- Docker installé
- MongoDB accessible (local ou cloud, ex: MongoDB Atlas)

---

## 🧱 Construction Docker

```bash
docker build -t appliplumeroweb .
```

### 🧩 Exécution en local (avec Docker Compose)

```bash
docker-compose up --build
```

👉 L’application sera accessible sur [http://localhost:8080](http://localhost:8080)

---

## 🌍 Variables d’environnement de production

À définir dans le fichier `.env.production` :

```bash
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://<USER_ATLAS>:<MOT_DE_PASSE_ATLAS>@<CLUSTER>.mongodb.net/appliplumeroweb?retryWrites=true&w=majority
JWT_SECRET=YOUR_SECURE_SECRET_KEY
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx
```

---

## 🔁 Mise à jour de l’application (build & relaunch)

```bash
docker-compose down
docker-compose build
docker-compose up -d
```

---

## ⚙️ Déploiement sur plateforme cloud

🚀 **Render / Railway / Heroku (selon choix)**  
-Configurer la variable `PORT` à **8080**  
-Ajouter toutes les variables de `.env.production`  
-Activer le déploiement automatique via **GitHub**

---

## 📊 Vérification post-déploiement

```bash
docker ps            # Les conteneurs doivent être "Up"
curl http://localhost:8080/healthcheck
docker logs appliplumeroweb_backend
```

---

## 🧩 Journalisation & maintenance

- Les logs de production sont stockés dans `backend/logs/`
- Utiliser le script :

  ```bash
  node scripts/automation/cleanupLogs.js
  ```

  pour purger les anciens logs

- Un job automatique gère :
  - l’optimisation d’images
  - la mise à jour du sitemap

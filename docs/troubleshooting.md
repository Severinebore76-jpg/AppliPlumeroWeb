# 🩺 Guide de dépannage — AppliPlumeroWeb

## ⚙️ 1. Erreurs au démarrage du serveur

**Symptôme :**

[nodemon] app crashed - waiting for file changes before starting…

SyntaxError: The requested module ‘./routes/auth.js’ does not provide an export named ‘default’
**Cause probable :**

- Mauvais type d’export (`export default` manquant dans `auth.js`).
- Fichier mal importé (typo, chemin erroné).

**Solution :**

✅ Vérifier que tous les fichiers de routes se terminent bien par :

export default router;

---

## **⚙️ 2. Connexion MongoDB impossible**

**Symptôme :**

❌ MongoDB connection error: Authentication failed

**Causes probables :**

- Mauvais MONGO_URI dans .env.
- Cluster Atlas mal configuré (user non autorisé).
- MongoDB local non démarré.

**Solutions :**

1. Vérifier la valeur de MONGO_URI dans .env.
2. Tester la connexion via mongosh.
3. Si MongoDB Atlas : s’assurer que ton IP est autorisée dans “Network Access”.

---

## **⚙️ 3. Problèmes Docker**

**Symptôme :**

ERROR: failed to solve: process "/bin/sh -c npm ci" did not complete successfully

**Causes :**

- Conflit de version Node.js entre hôte et conteneur.
- Cache Docker corrompu.
  **Solutions :**

docker system prune -af
docker-compose build --no-cache
docker-compose up -d

---

## **⚙️ 4. Le serveur répond mais les routes renvoient 404**

**Causes possibles :**

- Routes non montées dans index.js.
- Erreur de casse (majuscule/minuscule) sur les chemins.
- Middleware notFoundHandler non appliqué.
  **Solution :**

Vérifier dans index.js :
app.use("/api/romans", romanRoutes);
app.use(notFoundHandler);

---

## **⚙️ 5. Problèmes liés à**

## **.env**

**Symptôme :**

Error: Cannot read properties of undefined (reading 'MONGO_URI')

**Causes :**

- Fichier .env manquant ou mal nommé.
- Mauvais chemin lors du lancement Docker.

**Solution :**

- Vérifier la présence du fichier .env à la racine du projet.
- Si Docker : ajouter env_file: - .env dans docker-compose.yml.

---

## **⚙️ 6. Déploiement CI/CD échoué (GitHub Actions)**

**Symptôme :**

✖ Build failed: Cannot find module 'express'

**Causes :**

- Installation incomplète des dépendances.
- Absence de npm ci dans la configuration deploy.yml.
  **Solution :**

Ajouter dans .github/workflows/deploy.yml :

- name: Install dependencies
  run: npm ci

---

## **⚙️ 7. Tests en échec**

**Symptôme :**

Error: Timeout of 5000ms exceeded

**Causes :**

- MongoDB non connecté avant l’exécution des tests.
- Mauvaise configuration Jest.

**Solution :**

Vérifier que ton test initialise bien la connexion :

beforeAll(async () => await connectDB());

---

## **📊 Astuces rapides**

- npm cache clean --force → réinitialise les dépendances.
- docker logs < id > → affiche les erreurs du conteneur.
- CTRL + C puis npm run dev → redémarre nodemon.
- Si rien ne marche : supprime /node_modules + package-lock.json, puis relance npm ci.

---

© 2025 – **AppliPlumeroWeb** | Guide de dépannage interne

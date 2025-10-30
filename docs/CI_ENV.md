# ⚙️ CI/CD — Variables d’Environnement et Configuration

## 🎯 Objectif

Ce document référence toutes les **variables d’environnement** utilisées dans le cadre de l’intégration continue et du déploiement automatisé d’**AppliPlumeroWeb**.  
Il sert à maintenir la cohérence entre les fichiers `.env`, les secrets GitHub, et les variables injectées dans Docker.

---

## 🧱 1. Structure de référence

| Environnement | Fichier associé                                 | Utilisation principale           |
| ------------- | ----------------------------------------------- | -------------------------------- |
| Local         | `.env.development`                              | Développement sur poste          |
| Docker        | `.env`                                          | Build & run des conteneurs       |
| Production    | `.env.production`                               | Déploiement sur Render / Railway |
| CI/CD         | Secrets GitHub (`Settings > Secrets > Actions`) | Déploiement automatisé           |

---

## 🔐 2. Variables principales

| Nom                 | Description                     | Exemple de valeur                                | Sensibilité  |
| ------------------- | ------------------------------- | ------------------------------------------------ | ------------ |
| `NODE_ENV`          | Type d’environnement exécuté    | `development` / `production`                     | Non sensible |
| `PORT`              | Port d’écoute du backend        | `8080`                                           | Non sensible |
| `MONGO_URI`         | URI complète de la base MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` | 🔒 Sensible  |
| `JWT_SECRET`        | Clé de chiffrement JWT          | `supersecretkey12345`                            | 🔒 Sensible  |
| `STRIPE_SECRET_KEY` | Clé privée Stripe               | `sk_live_xxx`                                    | 🔒 Sensible  |
| `STRIPE_PUBLIC_KEY` | Clé publique Stripe             | `pk_live_xxx`                                    | Moyenne      |
| `SMTP_USER`         | Compte d’envoi email            | `no-reply@appliplumeroweb.com`                   | 🔒 Sensible  |
| `SMTP_PASS`         | Mot de passe SMTP               | `********`                                       | 🔒 Sensible  |

---

## 🧩 3. Variables spécifiques CI/CD

| Variable                   | Description                  | Défaut                        |
| -------------------------- | ---------------------------- | ----------------------------- |
| `CI`                       | Définit le mode CI dans Node | `true`                        |
| `DOCKER_BUILDKIT`          | Optimisation build Docker    | `1`                           |
| `COMPOSE_DOCKER_CLI_BUILD` | Active le moteur CLI Docker  | `1`                           |
| `GH_TOKEN`                 | Jeton GitHub pour Actions    | Doit être ajouté manuellement |
| `RENDER_API_KEY`           | Clé API Render (si utilisée) | Facultatif                    |

---

## 🧰 4. Secrets à définir sur GitHub Actions

1. Accéder à :  
   `GitHub → Settings → Secrets and variables → Actions`
2. Créer les secrets suivants :
   - `MONGO_URI`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLIC_KEY`
   - `SMTP_USER`
   - `SMTP_PASS`
3. (Optionnel) Ajouter :
   - `RENDER_API_KEY` → si déploiement sur Render
   - `RAILWAY_TOKEN` → si usage Railway

---

## 🔄 5. Synchronisation entre `.env` et CI

Pour éviter toute incohérence :
-Garder `.env.example` **comme référence unique**.
-Ne jamais commit `.env`, `.env.production`, `.env.local`.
-Les workflows GitHub doivent charger les secrets via :

env:
NODE_ENV: production
MONGO_URI: ${{ secrets.MONGO_URI }}
JWT_SECRET: ${{ secrets.JWT_SECRET }}

🧠 6. Vérification post-déploiement

Vérifier les variables actives dans le conteneur :
docker exec -it appliplumeroweb_backend printenv | grep MONGO

Vérifier les logs CI/CD :
• GitHub → Actions → Deploy to Production → View Logs
• Contrôler la section env: pour voir les variables injectées.

⸻

🔍 7. Bonnes pratiques
• ⚠️ Ne jamais afficher les variables sensibles dans les logs CI.
• 💾 Sauvegarder une copie chiffrée de .env.production dans ton coffre-fort personnel.
• 🧩 Uniformiser les noms entre .env et secrets.GITHUB (exactement les mêmes clés).
• 🧰 Mettre à jour ce document à chaque ajout/suppression de variable.

⸻

© 2025 – AppliPlumeroWeb | Document interne – Configuration CI/CD

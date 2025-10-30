# 🏗️ Architecture Technique — AppliPlumeroWeb

## 🎯 Objectif

Ce document présente la structure complète de l’application **AppliPlumeroWeb**, son organisation interne et la logique d’interconnexion entre les différentes couches du projet.

---

## 🧱 1. Structure Générale du Projet

AppliPlumeroWeb/
├── backend/ → API REST, logique métier, connexion MongoDB
├── frontend/ → Interface utilisateur (React + Vite)
├── public/ → Fichiers statiques, SEO, favicon, manifest
├── scripts/ → Automatisation, déploiement, sauvegardes
├── docs/ → Documentation technique et fonctionnelle
├── .github/workflows/ → Intégration continue (CI/CD)
├── Dockerfile → Configuration de conteneurisation
├── docker-compose.yml → Orchestration des services (Node, MongoDB)
└── .env\* → Variables d’environnement

---

## ⚙️ 2. Stack Technologique

| Couche               | Technologie               | Description                                           |
| -------------------- | ------------------------- | ----------------------------------------------------- |
| **Frontend**         | React + Vite              | Interface utilisateur, navigation dynamique           |
| **Backend**          | Node.js + Express         | API RESTful, logique serveur                          |
| **Base de données**  | MongoDB (Atlas ou Docker) | Stockage NoSQL des utilisateurs, romans, commentaires |
| **Authentification** | JWT                       | Gestion des tokens d’accès                            |
| **Paiement**         | Stripe                    | Gestion des abonnements et transactions               |
| **Conteneurisation** | Docker                    | Déploiement isolé et portable                         |
| **CI/CD**            | GitHub Actions            | Automatisation du déploiement                         |
| **Monitoring**       | Winston + Logs            | Suivi et audit du serveur                             |

---

## 🔗 3. Interconnexion des Couches

[ React (Frontend) ]
↓ API REST
[ Express (Backend) ]
↓
[ MongoDB (Database) ]

- Le **frontend** communique avec le **backend** via des requêtes HTTP sécurisées (Axios / Fetch).
- Le **backend** gère les routes API, applique les middlewares et interagit avec la **base MongoDB**.
- Les **scripts** (seed, backup, deploy) assurent la maintenance et l’automatisation.

---

## 🧩 4. Structure du Backend (MVC étendu)

backend/
├── config/ → Connexion DB, logger, Stripe, Swagger
├── controllers/ → Logique des routes (CRUD, auth, payments)
├── middleware/ → Sécurité, validation, logging, gestion des erreurs
├── models/ → Schémas Mongoose
├── routes/ → Points d’entrée API (groupés par ressource)
├── services/ → Logique métier indépendante des routes
├── jobs/ → Automatisations (notifications, backups)
├── utils/ → Fonctions réutilisables (date, slug, jwt)
└── index.js → Point d’entrée du serveur Express

---

## 🖥️ 5. Structure du Frontend (React + Vite)

frontend/
├── src/
│ ├── pages/ → Vues principales (Home, Romans, Admin, etc.)
│ ├── components/ → Composants réutilisables (UI, Layout, etc.)
│ ├── hooks/ → Custom Hooks (auth, fetch, analytics)
│ ├── context/ → Context API (auth, thème, notifications)
│ ├── api/ → Requêtes vers le backend
│ ├── store/ → Gestion d’état local
│ ├── styles/ → Fichiers CSS globaux et variables
│ └── locales/ → Traductions i18n (fr, en)
├── index.html
├── main.jsx
└── vite.config.js

---

## 📡 6. Flux de Données Simplifié

Utilisateur → Frontend (React) → Backend (API) → MongoDB
↑
WebSocket/HTTP

- Les requêtes passent par `axios` ou `fetch()`.
- Les réponses JSON sont renvoyées au frontend.
- Les mises à jour temps réel pourront être gérées ultérieurement via WebSockets.

---

## 🔐 7. Sécurité & Accès

| Mécanisme    | Description                             |
| ------------ | --------------------------------------- |
| JWT          | Authentification sécurisée côté serveur |
| Helmet       | Protection des headers HTTP             |
| Rate Limiter | Prévention brute-force                  |
| CORS Config  | Filtrage des domaines autorisés         |
| Logger       | Suivi des requêtes et erreurs           |

---

## 🧩 8. Environnements

| Environnement     | Description               | Fichier associé    |
| ----------------- | ------------------------- | ------------------ |
| **Développement** | Local avec Docker Compose | `.env.development` |
| **Production**    | Déploiement cloud         | `.env.production`  |
| **Exemple**       | Modèle de référence       | `.env.example`     |

---

## 📜 9. Maintenance & Mises à jour

- Toute modification structurelle du projet doit être consignée dans le `CHANGELOG.md`.
- Les dépendances critiques doivent être mises à jour via `npm audit` une fois par mois.
- Les scripts d’automatisation (`/scripts/automation/`) sont exécutés via cronjobs internes à Docker.

---

© 2025 – AppliPlumeroWeb | Documentation technique interne

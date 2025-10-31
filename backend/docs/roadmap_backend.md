# FicheCode backend / docs / roadmap_backend.md

---

📁 **Emplacement** : AppliPlumeroWeb/backend/docs/roadmap_backend.md
📦 **Phase** : 0 → 4 — Suivi global du développement backend
🧠 **Composant** : Documentation technique / Pilotage projet
🧾 **Statut** : ✅ En cours d’évolution continue
🕓 **Dernière révision** : 30/10/2025

---

## **🧭 Résumé fonctionnel**

- Ce document centralise la **feuille de route technique du backend** de l’application **AppliPlumeroWeb**, organisée en **phases logiques de développement**, afin de garantir une progression claire, testée et documentée à chaque étape.
- Il sert de référence pour le suivi de production, les commits GitHub et les validations fonctionnelles.

---

### **⚙️ Structure de la roadmap**

| **Phase**                                | **Objectif principal**                                                                                                              | **Statut**   | **Détails clés**                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------- |
| **0 — Préparation & Infrastructure**     | Création de l’arborescence, fichiers fondamentaux, configuration Docker, base MongoDB, scripts utilitaires, documentation initiale. | ✅ Terminée  | .env, Dockerfile, README_DEPLOY.md, scripts/, docs/      |
| **1 — Initialisation Backend**           | Mise en place du serveur Express, sécurité de base, middlewares globaux, gestion d’erreurs, logs, CORS, Swagger, santé API.         | 🟡 En cours  | index.js, errorHandler.js, securityHeaders.js, logger.js |
| **2 — Modules Romans & Comments**        | Gestion CRUD complète des romans et commentaires avec validation Joi, permissions, relations MongoDB, et pagination.                | ⏳ À venir   | models/, controllers/, services/, utils/validation.js    |
| **3 — Authentification & Utilisateurs**  | Inscription, connexion JWT, gestion de rôles, profil utilisateur, sécurité renforcée.                                               | 🔜 Planifiée | authController.js, userModel.js, authMiddleware.js       |
| **4 — Paiements & Abonnements (Stripe)** | Intégration Stripe (test puis live), gestion des tokens, suivi des transactions, et logs financiers.                                | ⏳ Planifiée | paymentService.js, subscriptionModel.js                  |
| **5 — Notifications & Jobs automatisés** | Cron jobs, nettoyage logs, backup, optimisation images, mise à jour sitemap.                                                        | 🔜 Prévue    |                                                          |

---

### **🧱 Dépendances critiques à surveiller**

| **Composant** | **Librairie**     | **Version actuelle** | **Statut**            |
| ------------- | ----------------- | -------------------- | --------------------- |
| Serveur HTTP  | Express           | 5.1.0                | ✅ Stable             |
| ORM           | Mongoose          | 8.19.2               | ✅ Stable             |
| Sécurité      | Helmet, CORS, JWT | à jour               | 🟢 OK                 |
| Validation    | Joi               | 18.0.1               | 🟢 OK                 |
| Logs          | Morgan / Winston  | 3.18.3               | 🟢 OK                 |
| Paiement      | Stripe            | 19.1.0               | 🔜 À intégrer Phase 4 |

---

### **🧪 Points de validation continue**

- Tests unitaires sur routes /api/health, /api/romans, /api/comments
- Linter / MarkdownLint → zéro erreur MD0xx
- Validation Docker (build + run sans erreur)
- Vérification logs backend (combined.log, error.log)
- Connexion stable MongoDB Atlas + local
- Synchronisation GitHub / GitHub Actions (deploy.yml)

---

### **🪶 Notes de pilotage**

- > Toutes les phases doivent être commit sur la branche main uniquement après validation technique.
- > Les évolutions majeures (auth, Stripe, notifications) feront l’objet d’une fiche dédiée (\_feature_spec.md).
- > Chaque étape validée doit être accompagnée d’une **ficheCode complète** du ou des fichiers créés.
- > Une **review de sécurité** (CSP, CORS, JWT, XSS) est obligatoire avant toute mise en ligne.

---

### **🧩 Historique de versions**

| **Date**   | **Type de modif**    | **Description**                              | **Auteur**    |
| ---------- | -------------------- | -------------------------------------------- | ------------- |
| 30/10/2025 | ✅ Création initiale | Mise en place de la roadmap backend complète | Séverine Boré |
| –          | –                    | –                                            | –             |

# 🧩 Backend — AppliPlumeroWeb

## ⚙️ Stack Technique

- **Node.js** + **Express**
- **MongoDB** (via Mongoose)
- **JWT** pour l’authentification
- **Helmet**, **CORS**, **Morgan** pour la sécurité et les logs

---

## 🧱 Structure du backend

```bash
backend/
├── config/             → Configuration base de données et variables globales
├── controllers/        → Logique métier (auth, users, romans, comments)
├── middleware/         → Middlewares (auth, validation, erreurs)
├── models/             → Schémas MongoDB
├── routes/             → Routes Express
├── utils/              → Fonctions utilitaires
├── healthcheck.js      → Vérification du statut serveur / DB
├── index.js            → Point d’entrée principal du backend
└── README.md           → Ce fichier

🚀 Lancement local
cd backend
npm install
npm run dev

Accessible sur :
👉 http://localhost:8080/api/health￼

⸻

🔒 Sécurité
• Variables sensibles stockées dans .env
• Sécurisation des headers via Helmet
• Limitation des origines via CORS
• Gestion centralisée des erreurs via errorHandler.js

⸻

🧪 Tests API

Exemple : Vérifier la route de santé
curl http://localhost:8080/api/health

Réponse attendue :
{
  "server": "🟢 OK",
  "database": "connecté"
}
🗂️ Modules principaux

Module
Description
auth
Authentification utilisateur (JWT)
users
Gestion des comptes utilisateurs
romans
Création, édition, lecture de romans
comments
Système de commentaires sur les romans

🧩 Automatisation & Maintenance
• Logs : /backend/logs/
• Scripts automatisés : /scripts/automation/
 • Sauvegardes MongoDB : scripts/backup.js

⸻

🧾 Notes
• L’ensemble du backend est pensé pour être containerisé via Docker.
• Les environnements de dev et prod utilisent des .env distincts.
• Compatible avec Render, Railway ou toute plateforme Node 20+.

⸻

👤 Auteur

Séverine Boré — Projet Plumero / AppliPlumeroWeb
© 2025 — Tous droits réservés.
```

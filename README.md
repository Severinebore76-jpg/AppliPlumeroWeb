# 📚 AppliPlumeroWeb

> Plateforme de lecture en ligne et mobile — Romans interactifs, commentaires, abonnements, et espace auteurs.

---

## 🚀 Présentation

**AppliPlumeroWeb** est une application web full-stack développée en **Node.js / Express** (backend) et **React + Vite** (frontend), connectée à une base **MongoDB**.  
Le projet est structuré en **phases de développement progressives**, permettant une montée en puissance maîtrisée jusqu’au déploiement complet.

---

## 🧭 Objectifs du projet

- 🧱 Créer une architecture **modulaire, scalable et documentée**.
- 💬 Permettre aux lecteurs de **lire, commenter et interagir** avec les romans.
- 💳 Gérer les **abonnements et paiements** via Stripe.
- 🔒 Assurer la **sécurité et la conformité** des données utilisateurs.
- 🚀 Déployer une application **performante, testée et maintenable**.

---

## 🏗️ Stack technique

| Couche           | Technologie        | Description                                                |
| ---------------- | ------------------ | ---------------------------------------------------------- |
| Backend          | Node.js / Express  | API REST, logique métier                                   |
| Base de données  | MongoDB (Mongoose) | Stockage des utilisateurs, romans, commentaires, paiements |
| Frontend         | React + Vite       | Interface utilisateur rapide et responsive                 |
| Authentification | JWT + Middleware   | Gestion sécurisée des sessions                             |
| Paiement         | Stripe API         | Abonnements et achats intégrés                             |
| Environnement    | Docker + Makefile  | Conteneurisation et automatisation                         |
| CI/CD            | GitHub Actions     | Déploiement continu                                        |
| Tests            | Jest / Supertest   | Tests unitaires et d’intégration                           |

---

## 🧩 Structure du projet

AppliPlumeroWeb/
│
├── backend/
├── frontend/
├── docs/
├── scripts/
├── public/
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── .env
├── .gitignore
└── README.md

---

## ⚙️ Installation et exécution

### 🧾 Prérequis

- Node.js ≥ 20
- npm ≥ 9
- Docker & Docker Compose
- MongoDB (local ou cloud)

### 🔧 Installation locale

```bash
git clone https://github.com/severinebore/appliplumeroweb.git
cd appliplumeroweb
cd backend && npm install
cd ../frontend && npm install

🚀 Lancer le projet

Option 1 — En local
cd backend
npm run dev

Option 2 — Via Docker
make up

👉 Accessible sur : http://localhost:8080

⸻

📦 Déploiement

Géré par :
•Dockerfile et docker-compose.yml
•.Procfile
•.github/workflows/deploy.yml

Variables définies dans .env.production.

⸻

🧪 Tests
cd backend
npm test

⸻

🔒 Sécurité

Voir : SECURITY.md￼

⸻

🧭 Roadmap par phases

Phase
Intitulé
Statut
0
Initialisation du projet
✅ Terminé
1
Fondations techniques (backend)
🔄 En cours
2
Cœur métier
⏳ À venir
3
Monétisation
⏳ À venir
4
Frontend React/Vite
⏳ À venir
5
Déploiement & optimisation
⏳ À venir

⸻

👩‍💻 Auteure

Séverine Boré
📧 contact@appliplumeroweb.com
🌐 www.appliplumeroweb.com￼

⸻

📜 Licence

Sous licence MIT — voir LICENSE.md￼
```

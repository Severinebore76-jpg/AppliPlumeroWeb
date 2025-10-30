# 🗺️ Roadmap Fonctionnelle — AppliPlumeroWeb

## 🎯 Objectif

Cette roadmap définit les grandes étapes de développement de l’application **AppliPlumeroWeb**, en suivant une logique incrémentale et modulaire.  
Elle sert de référence pour la planification technique et la priorisation des fonctionnalités.

---

## 🧩 Phase 0 — Initialisation du projet ✅

| Étape | Élément                  | Objectif                                        | Statut                      |
| ----- | ------------------------ | ----------------------------------------------- | --------------------------- |
| 0.1   | Environnements & Config  | Préparer Docker, .env, Git et structure de base | ✅ Terminé                  |
| 0.2   | Sécurité & Documentation | LICENSE, SECURITY, README, CHANGELOG            | ✅ Terminé                  |
| 0.3   | Documentation & Scripts  | Création des docs et scripts d’automatisation   | 🟢 En cours de finalisation |

---

## ⚙️ Phase 1 — Backend : Fondations techniques

| Étape | Élément            | Objectif                                 | Statut     |
| ----- | ------------------ | ---------------------------------------- | ---------- |
| 1.1   | Serveur Express    | Initialiser Express + connexion MongoDB  | 🔵 À venir |
| 1.2   | Middleware         | Gérer erreurs, sécurité, logs, CORS      | 🔵 À venir |
| 1.3   | Routes système     | Auth, Health, Users (structure minimale) | 🔵 À venir |
| 1.4   | Tests & Validation | Postman + Jest sur endpoints de base     | 🔵 À venir |

---

## 📚 Phase 2 — Cœur métier (Romans, Commentaires, Users)

| Étape | Élément              | Objectif                       | Statut     |
| ----- | -------------------- | ------------------------------ | ---------- |
| 2.1   | Models & Controllers | CRUD complet Romans & Comments | 🔵 À venir |
| 2.2   | Services             | Externaliser la logique métier | 🔵 À venir |
| 2.3   | Authentification     | JWT, rôles, permissions        | 🔵 À venir |
| 2.4   | Tests d’intégration  | Vérifier cohérence API / DB    | 🔵 À venir |

---

## 💳 Phase 3 — Monétisation & Automatisation

| Étape | Élément               | Objectif                          | Statut     |
| ----- | --------------------- | --------------------------------- | ---------- |
| 3.1   | Stripe                | Paiement & abonnement utilisateur | 🔵 À venir |
| 3.2   | Cron Jobs             | Nettoyage logs, backup, sitemap   | 🔵 À venir |
| 3.3   | Automatisation emails | Notifications / relances          | 🔵 À venir |
| 3.4   | Tests & Sandbox       | Vérifications transactions Stripe | 🔵 À venir |

---

## 🖥️ Phase 4 — Frontend (React + Vite)

| Étape | Élément        | Objectif                        | Statut     |
| ----- | -------------- | ------------------------------- | ---------- |
| 4.1   | Structure Vite | Base projet React + routing     | 🔵 À venir |
| 4.2   | UI & Pages     | Lecture, Auth, Profil, Admin    | 🔵 À venir |
| 4.3   | Liaison API    | Connexion au backend via Axios  | 🔵 À venir |
| 4.4   | i18n & UX      | Traduction FR/EN + design final | 🔵 À venir |

---

## 🚀 Phase 5 — Déploiement & Optimisation

| Étape | Élément              | Objectif                               | Statut     |
| ----- | -------------------- | -------------------------------------- | ---------- |
| 5.1   | Docker & CI/CD       | Pipeline GitHub Actions + Render       | 🔵 À venir |
| 5.2   | Monitoring           | Logs, sécurité, backup automatisé      | 🔵 À venir |
| 5.3   | Documentation finale | Mise à jour docs + guides utilisateurs | 🔵 À venir |

---

## 🔁 Maintenance & Mises à jour continues

- Audit des dépendances tous les mois (`npm audit fix`).
- Rotation des clés JWT & Stripe tous les 6 mois.
- Mise à jour du `CHANGELOG.md` à chaque version stable.
- Suivi de la performance MongoDB via Atlas Metrics.

---

## 🧭 Vue d’ensemble chronologique

Phase 0 → Base technique
Phase 1 → API & Backend
Phase 2 → Métier (Romans, Users, Comments)
Phase 3 → Paiements & Automatisation
Phase 4 → Interface utilisateur
Phase 5 → Déploiement & Maintenance

---

## 🧱 Vision long terme

> Créer une plateforme de lecture immersive, multilingue, sécurisée et monétisable.  
> Les utilisateurs pourront lire, commenter, s’abonner et interagir dans un espace simple, élégant et fluide.

---

© 2025 – AppliPlumeroWeb | Document interne – Roadmap produit & technique

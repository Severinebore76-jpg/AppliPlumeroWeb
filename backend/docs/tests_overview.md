# 🧩 Tests Backend — Vue d’ensemble (Phase 1)

---

## 🧱 1. Tests Unitaires

| Fichier               | Fonction testée              | Statut      | Couverture |
| --------------------- | ---------------------------- | ----------- | ---------- |
| utils/apiResponse.js  | success(), error()           | ✅ OK       | 100%       |
| utils/roles.js        | hasPermission()              | ✅ OK       | 100%       |
| utils/captchaUtils.js | verifyCaptcha() (mock Axios) | ⚙️ En cours | 85%        |

---

## 🔗 2. Tests d’Intégration

| Module                        | Objectif                                   | Statut    |
| ----------------------------- | ------------------------------------------ | --------- |
| controllers/authController.js | Inscription / Connexion / Vérification JWT | ✅ Stable |
| middleware/authMiddleware.js  | Validation du token et accès protégé       | ✅ Stable |
| middleware/errorHandler.js    | Formatage cohérent des erreurs HTTP        | ✅ Stable |

---

## 🌐 3. Tests d’API (via Supertest)

| Endpoint             | Méthode | Attendu                       | Statut      |
| -------------------- | ------- | ----------------------------- | ----------- |
| `/api/auth/register` | POST    | 201 Created + token           | ✅          |
| `/api/auth/login`    | POST    | 200 OK + token                | ✅          |
| `/api/auth/verify`   | GET     | 200 OK si JWT valide          | ✅          |
| `/api/users/:id`     | PATCH   | 200 OK + données mises à jour | ⚙️ En cours |

---

## 🧩 4. Tests Manuels

- Vérification de `/register` via Postman
- Test de l’expiration du JWT
- Test du refus d’accès `/users/:id` sans token
- Observation des logs `requests.log` et `activity.log`

---

## 📊 5. Couverture & Maintenance

- Exécution : `npm run test:coverage`
- Objectif minimum : **90 % de couverture sur la logique d’authentification**
- Rapport généré : `/coverage/lcov-report/index.html`

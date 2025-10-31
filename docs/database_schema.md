# ⚙️ Référence de configuration — AppliPlumeroWeb

## 🔗 Connexion base de données

| Variable        | Exemple                                   | Description                        | Sensibilité |
| --------------- | ----------------------------------------- | ---------------------------------- | ----------- |
| `MONGO_URI`     | `mongodb://mongodb:27017/appliplumeroweb` | URI MongoDB local ou Atlas (cloud) | 🔒 Haute    |
| `MONGO_DB_NAME` | `appliplumeroweb`                         | Nom de la base utilisée            | 🔒 Faible   |

---

## 🔒 Sécurité & JWT

| Variable         | Exemple               | Description                   | Sensibilité   |
| ---------------- | --------------------- | ----------------------------- | ------------- |
| `JWT_SECRET`     | `supersecretkey12345` | Clé de chiffrement des tokens | 🔒 Très haute |
| `JWT_EXPIRES_IN` | `7d`                  | Durée de validité du token    | 🔒 Moyenne    |

---

## 💳 Paiement (Stripe)

| Variable            | Exemple          | Description         | Sensibilité   |
| ------------------- | ---------------- | ------------------- | ------------- |
| `STRIPE_SECRET_KEY` | `sk_test_abc123` | Clé privée Stripe   | 🔒 Très haute |
| `STRIPE_PUBLIC_KEY` | `pk_test_xyz456` | Clé publique Stripe | 🔒 Moyenne    |

---

## 📧 Emailing (SMTP)

| Variable     | Exemple                                    | Description          | Sensibilité   |
| ------------ | ------------------------------------------ | -------------------- | ------------- |
| `SMTP_HOST`  | `smtp.gmail.com`                           | Serveur SMTP utilisé | 🔒 Moyenne    |
| `SMTP_PORT`  | `587`                                      | Port SMTP            | 🔒 Faible     |
| `SMTP_USER`  | `example@gmail.com`                        | Identifiant SMTP     | 🔒 Haute      |
| `SMTP_PASS`  | `motdepasse123`                            | Mot de passe SMTP    | 🔒 Très haute |
| `EMAIL_FROM` | `"AppliPlumeroWeb <no-reply@plumero.com>"` | Adresse d’envoi      | 🔒 Faible     |

---

## ⚙️ Serveur & environnement

| Variable        | Exemple       | Description                       | Sensibilité |
| --------------- | ------------- | --------------------------------- | ----------- |
| `PORT`          | `8080`        | Port du backend Express           | 🔒 Faible   |
| `NODE_ENV`      | `development` | Environnement d’exécution         | 🔒 Faible   |
| `LOG_LEVEL`     | `info`        | Niveau de verbosité des logs      | 🔒 Faible   |
| `ENABLE_MORGAN` | `true`        | Active le middleware de logs HTTP | 🔒 Faible   |

---

## 🪶 Autres options

| Variable        | Exemple | Description                           | Sensibilité |
| --------------- | ------- | ------------------------------------- | ----------- |
| `ENABLE_EMAILS` | `true`  | Active/désactive l’envoi d’e-mails    | 🔒 Faible   |
| `ENABLE_STRIPE` | `true`  | Active/désactive les paiements Stripe | 🔒 Faible   |

---

## 🧱 Bonnes pratiques

- Ne jamais versionner les fichiers `.env` — ils doivent figurer dans `.gitignore`.
- Toujours créer une **copie modèle** (`.env.example`) sans valeurs sensibles.
- Les clés API doivent être **renouvelées tous les 6 mois**.
- Vérifier les droits IAM (Stripe, Atlas, etc.) avant chaque déploiement.

---

© 2025 – **AppliPlumeroWeb** | Documentation interne de configuration

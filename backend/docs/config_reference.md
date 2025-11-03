# ⚙️ Référentiel de Configuration — Backend AppliPlumeroWeb

Ce document liste toutes les variables d’environnement et constantes utilisées dans le backend.

---

## 🌍 Environnement général

| Variable       | Exemple                                        | Description                           |
| -------------- | ---------------------------------------------- | ------------------------------------- |
| `NODE_ENV`     | development / production                       | Détermine le mode d’exécution         |
| `PORT`         | 8080                                           | Port d’écoute du serveur Express      |
| `CORS_ORIGINS` | <https://plumero.com>, <http://localhost:5173> | Liste blanche des origines autorisées |
| `LOG_LEVEL`    | info                                           | Niveau de verbosité des logs          |

---

## 🗄️ Base de données

| Variable      | Exemple                                             | Description                       |
| ------------- | --------------------------------------------------- | --------------------------------- |
| `MONGODB_URI` | mongodb+srv://user:pass@cluster.mongodb.net/plumero | Chaîne de connexion MongoDB Atlas |
| `DB_NAME`     | plumero_db                                          | Nom de la base utilisée           |
| `DB_DEBUG`    | false                                               | Active les logs de requêtes Mongo |

---

## 🔒 Sécurité & Authentification

| Variable             | Exemple           | Description                                  |
| -------------------- | ----------------- | -------------------------------------------- |
| `JWT_SECRET`         | s3cr3tK3y987      | Clé secrète pour la génération de tokens JWT |
| `JWT_EXPIRES_IN`     | 3d                | Durée de validité du token                   |
| `COOKIE_SECRET`      | cookie_secret_key | Clé pour sécuriser les cookies signés        |
| `BCRYPT_SALT_ROUNDS` | 10                | Niveau de hachage pour les mots de passe     |

---

## 💳 Paiement & Intégrations

| Variable               | Exemple           | Description                     |
| ---------------------- | ----------------- | ------------------------------- |
| `STRIPE_SECRET_KEY`    | sk_live_123abc... | Clé privée Stripe               |
| `STRIPE_PUBLIC_KEY`    | pk_live_456xyz... | Clé publique Stripe (frontend)  |
| `PAYPAL_CLIENT_ID`     | AbCdEf123456      | Identifiant client PayPal       |
| `PAYPAL_CLIENT_SECRET` | GhIjKl789012      | Secret associé au compte PayPal |

---

## 📧 Emailing

| Variable     | Exemple                                | Description                    |
| ------------ | -------------------------------------- | ------------------------------ |
| `SMTP_HOST`  | smtp.gmail.com                         | Serveur SMTP                   |
| `SMTP_PORT`  | 587                                    | Port SMTP                      |
| `SMTP_USER`  | <noreply@plumero.com>                  | Compte utilisé pour l’envoi    |
| `SMTP_PASS`  | **\*\*\*\***                           | Mot de passe ou clé d’app      |
| `EMAIL_FROM` | AppliPlumeroWeb <no-reply@plumero.com> | Adresse expéditrice par défaut |

---

## ☁️ Stockage & Services externes

| Variable                | Exemple                                    | Description               |
| ----------------------- | ------------------------------------------ | ------------------------- |
| `CLOUDINARY_URL`        | cloudinary://API_KEY:API_SECRET@cloud_name | Identifiants Cloudinary   |
| `AWS_ACCESS_KEY_ID`     | AKIA...                                    | Accès S3 AWS (si utilisé) |
| `AWS_SECRET_ACCESS_KEY` | **\*\*\*\***                               | Secret AWS                |
| `AWS_BUCKET_NAME`       | plumero-assets                             | Nom du bucket de stockage |

---

## 🧩 Divers & Monitoring

| Variable           | Exemple                                         | Description                                 |
| ------------------ | ----------------------------------------------- | ------------------------------------------- |
| `SENTRY_DSN`       | <https://xxxxx@o000000.ingest.sentry.io/000000> | Clé pour le suivi d’erreurs                 |
| `APP_VERSION`      | 1.0.0                                           | Version courante du backend                 |
| `ENABLE_MORGAN`    | true                                            | Active les logs de requêtes HTTP            |
| `SHOW_STACK_TRACE` | false                                           | Contrôle l’affichage des erreurs détaillées |

---

> 🪶 **Notes**  
> • Ce fichier sert uniquement à la documentation ; aucune variable ne doit être stockée ici.  
> • Mettre à jour cette liste à chaque ajout/modification d’une variable d’environnement.  
> • Les valeurs sensibles doivent toujours rester hors dépôt Git.

# 🔒 Politique de sécurité — Backend AppliPlumeroWeb

## 1️⃣ Gestion des identités et des accès (IAM)

- Authentification via JWT (signés avec `JWT_SECRET`, durée `JWT_EXPIRES_IN`).
- Les tokens expirés sont rejetés immédiatement (statut 401).
- Les endpoints critiques (`DELETE`, `PUT`) nécessitent une double vérification :
  - présence d’un JWT valide ;
  - correspondance du rôle utilisateur (`admin`, `user`).
- Aucun mot de passe n’est stocké en clair : hash avec `bcrypt` (10 à 12 rounds).

---

## 2️⃣ Sécurité des données

- Données sensibles chiffrées avant stockage ou transfert (TLS/HTTPS obligatoire).
- Aucun dump MongoDB ne doit être transféré sans chiffrement (7z + mot de passe).
- Sauvegardes automatiques stockées sur un volume séparé (`/backups/`).

---

## 3️⃣ En-têtes HTTP et politiques CORS

- `helmet()` actif sur toutes les routes.
- CSP (Content Security Policy) restreint aux domaines approuvés :

default-src 'self';
img-src 'self' data:;
script-src 'self';
connect-src 'self' [https://api.stripe.com]

- CORS : autoriser uniquement les domaines définis dans `ALLOWED_ORIGINS`.
- Refuser toute requête sans en-tête `Origin` valide.

---

## 4️⃣ Journalisation et monitoring

- Logs d’erreurs conservés 7 jours max (`cleanupLogs.js`).
- Les logs sensibles (tokens, mots de passe, payloads) sont **filtrés** avant écriture.
- Les accès et anomalies critiques sont journalisés dans `error.log`.
- Aucun log n’est public ni exposé via l’API.

---

## 5️⃣ Sécurité applicative

- Validation stricte des entrées utilisateur via `Joi` (injection et XSS prévenus).
- Filtrage de contenu dans `contentFilterRules.js` pour bloquer les termes interdits.
- Protection contre :
- **Injection MongoDB** (`$ne`, `$or`, `$gt`, etc. bloqués dans les requêtes utilisateur)
- **Cross-Site Scripting (XSS)** via `helmet` + sanitation d’entrée
- **Rate-limiting** pour limiter le bruteforce (`rate-limiter-flexible`)
- Les cookies JWT sont marqués `HttpOnly` + `Secure` en prod.

---

## 6️⃣ Gestion des incidents

-En cas d’attaque (DDoS, fuite, intrusion) :
1.Isolation immédiate du conteneur concerné.  
2.Suppression des tokens actifs (`blacklist`).  
3.Notification à l’administrateur via mail sécurisé.  
4.Rapport d’incident consigné dans `/logs/security.log`.  
-Un audit complet est obligatoire sous 72h (RGPD, art. 33).

---

## 7️⃣ Bonnes pratiques

- Changer les clés JWT et STRIPE tous les **6 mois**.
- Mettre à jour les dépendances critiques avec `npm audit fix`.
- Interdire tout accès SSH root aux serveurs.
- Tester régulièrement la robustesse via `npm run security:test`.
- Ne jamais exposer `.env`, `logs/` ou `/backups/` sur un serveur public.

---

## 8️⃣ Conformité RGPD et confidentialité

- Droit à l’oubli : suppression complète du compte et de ses données sur demande.
- Export des données utilisateur disponible sur demande (`/api/users/export`).
- Conservation maximale des logs utilisateurs : 6 mois.
- Pas de tracking tiers ni cookie non essentiel côté backend.

---

© 2025 – **AppliPlumeroWeb** | Politique de sécurité interne

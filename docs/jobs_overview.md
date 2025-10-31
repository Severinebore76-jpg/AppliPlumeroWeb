# ⚙️ Vue d’ensemble des jobs automatisés — AppliPlumeroWeb

## 🔁 Scripts planifiés

| **Nom du job**                | **Fichier source**                     | **Fréquence**                            | **Description**                                                   |
| ----------------------------- | -------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------- |
| **Nettoyage des logs**        | `scripts/automation/cleanupLogs.js`    | Tous les jours à 2h00                    | Supprime les logs de plus de 7 jours pour économiser de l’espace. |
| **Optimisation des images**   | `scripts/automation/optimizeImages.js` | Hebdomadaire (dimanche 3h00)             | Compresse les fichiers `.jpg` et `.png` du dossier public/.       |
| **Mise à jour du sitemap**    | `scripts/automation/updateSitemap.js`  | Quotidienne (minuit)                     | Regénère le sitemap.xml pour le SEO.                              |
| **Sauvegarde MongoDB**        | `scripts/backup.js`                    | Tous les jours à 1h00                    | Exporte la base MongoDB dans `/backups/`.                         |
| **Déploiement auto**          | `scripts/deploy.js`                    | Manuelle (via CI/CD)                     | Déclenche un build et push du conteneur Docker.                   |
| **Initialisation de la base** | `scripts/seed.js`                      | Une fois lors de la phase d’installation | Insère les données de test (romans, users, etc.).                 |

---

## 🧠 Détails d’exécution

Les jobs utilisent le module **`node-cron`** ou des appels manuels via `npm run`.  
Chaque tâche est isolée dans son propre script JS pour une meilleure maintenabilité.

Exemple de planification type :

import cron from "node-cron";
import cleanupLogs from "../scripts/automation/cleanupLogs.js";

cron.schedule("0 2 \*\*\*", cleanupLogs); // Tous les jours à 2h du matin

---

## **🧾 Journalisation**

Tous les jobs écrivent dans les fichiers suivants :

- /logs/combined.log → activité normale
- /logs/error.log → erreurs d’exécution
- /logs/debug.log → logs de diagnostic (mode développement)

---

## **🧱 Bonnes pratiques**

- Toujours tester les jobs manuellement avant déploiement.
- Utiliser un système de notifications (mail/Slack) en cas d’échec.
- Surveiller la taille du dossier /backups/.
- Coupler les tâches critiques avec un script de vérification (healthcheck.js).

---

© 2025 – **AppliPlumeroWeb** | Documentation interne – Automations & Maintenance

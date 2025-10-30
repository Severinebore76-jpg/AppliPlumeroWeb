# 🔐 Politique de sécurité — AppliPlumeroWeb

## 📅 Dernière mise à jour

29 octobre 2025

---

## 🧭 Objectif

Ce document décrit les procédures à suivre pour **signaler, évaluer et corriger les vulnérabilités de sécurité** dans le projet **AppliPlumeroWeb**.

La sécurité de nos utilisateurs et de leurs données est une priorité absolue.  
Toute faille signalée sera traitée avec rigueur, transparence et confidentialité.

---

## 🛠️ Signalement d’une vulnérabilité

Si vous découvrez une faille ou un comportement suspect :

1. **Ne publiez pas publiquement** les détails du problème.
2. Contactez directement la responsable du projet :
   - 📧 **Séverine Boré** — `security@appliplumeroweb.com`
3. Fournissez :
   - Une description claire du problème
   - Les étapes pour le reproduire
   - L’impact potentiel estimé
   - Si possible, une proposition de correction

Les signalements sont généralement traités **dans les 48 à 72 heures**.

---

## 🧩 Versions concernées

| Version | Statut    | Remarques                               |
| ------- | --------- | --------------------------------------- |
| 0.1.0   | 🟢 Stable | Version initiale — aucun incident connu |
| 0.0.1   | 🟢 Stable | Environnement local uniquement          |

> Les versions de développement internes sont surveillées en continu via **npm audit** et les scans de sécurité GitHub Dependabot.

---

## 🧰 Processus de correction

1. **Reproduction** et validation de la faille signalée.
2. **Évaluation** du niveau de gravité (mineure, majeure, critique).
3. **Déploiement d’un correctif** sur une branche dédiée (`security/fix-xxx`).
4. **Vérification** du correctif par tests automatisés et manuels.
5. **Publication d’un patch** avec mention dans le `CHANGELOG.md`.

---

## 🔒 Bonnes pratiques internes

- Mises à jour régulières des dépendances (`npm audit fix`).
- Utilisation de **variables d’environnement sécurisées** (`.env.production`).
- Journalisation contrôlée des erreurs (aucune donnée sensible dans les logs).
- Stockage des mots de passe via **bcrypt + salt**.
- Usage de **HTTPS** obligatoire en production.
- Revue de code systématique avant tout merge vers `main`.

---

## 📞 Contact d’urgence

En cas d’incident majeur affectant les utilisateurs :

- Contact direct : `security@appliplumeroweb.com`
- Canal secondaire : `contact@appliplumeroweb.com`

---

Merci à toute la communauté et aux testeurs pour leur vigilance et leur aide dans l’amélioration continue de la sécurité d’AppliPlumeroWeb.

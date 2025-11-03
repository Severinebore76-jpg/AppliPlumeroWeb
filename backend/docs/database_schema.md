# 📚 Schéma de Base de Données — AppliPlumeroWeb

## 🧱 1. Utilisateurs (`User`)

- **Champs clés** : `_id`, `username`, `email`, `role`, `status`, `avatarUrl`
- **Relations** :
  - 1 → N avec `Roman`
  - 1 → N avec `Comment`
  - 1 → N avec `Message` (`sender`, `receiver`)
  - 1 → N avec `Device`
  - 1 → N avec `Feedback`
- **Index** :
  - `email` (unique)
  - `username` (text, unique)
  - `status`, `role`

---

## 📖 2. Romans (`Roman`)

- **Champs clés** : `_id`, `title`, `slug`, `author`, `status`, `ratings`
- **Relations** :
  - N → 1 avec `User` (auteur)
  - 1 → N avec `Comment`
  - 1 → N avec `Chapter`
  - 1 → N avec `Rating`
- **Index** :
  - `slug + author` (unique)
  - `status`, `visibility`, `language`, `tags[]`
- **Soft delete** :
  - `isDeleted`, `deletedAt`, `deletedBy`

---

## 💬 3. Commentaires (`Comment`)

- **Champs clés** : `_id`, `roman`, `author`, `content`, `parentId`
- **Relations** :
  - N → 1 avec `Roman`
  - N → 1 avec `User` (auteur)
  - auto-référence via `parentId` pour les threads
- **Index** :
  - `roman + parentId`
  - `isDeleted`, `status`

---

## 🌟 4. Notes & Évaluations (`Rating`)

- **Champs clés** : `_id`, `user`, `roman`, `value`
- **Relations** :
  - N → 1 avec `User`
  - N → 1 avec `Roman`
- **Index** :
  - `(user, roman)` unique
  - `roman` pour l’agrégation des moyennes

---

## 💌 5. Messages (`Message`)

- **Champs clés** : `_id`, `sender`, `receiver`, `content`, `status`
- **Relations** :
  - N → 1 avec `User` (sender)
  - N → 1 avec `User` (receiver)
- **Index** :
  - `(sender, receiver, createdAt)`
  - `isDeletedBySender`, `isDeletedByReceiver`

---

## 🧭 6. Appareils & Connexions (`Device`)

- **Champs clés** : `_id`, `user`, `deviceId`, `os`, `browser`, `active`
- **Relations** :
  - N → 1 avec `User`
- **Index** :
  - `(user, active)`
  - `deviceId` (unique)
- **Soft delete** :
  - `isDeleted`, `deletedAt`

---

## 🪶 7. Feedbacks & Signalements (`Feedback`)

- **Champs clés** : `_id`, `user`, `type`, `targetType`, `priority`, `status`
- **Relations** :
  - N → 1 avec `User`
  - Variable selon `targetType` : `Roman`, `Comment`, `User`
- **Index** :
  - `(status, priority)`
  - `isDeleted`

---

## 🔔 8. Notifications (`Notification`)

- **Champs clés** : `_id`, `user`, `type`, `message`, `read`
- **Relations** :
  - N → 1 avec `User`
  - 1 → 1 possible avec `Comment`, `Message` ou `Feedback`
- **Index** :
  - `user + read`
  - `type`

---

## 🔄 9. Synchronisation (`SyncData`)

- **Champs clés** : `_id`, `user`, `device`, `syncDirection`, `status`
- **Relations** :
  - N → 1 avec `User`
  - N → 1 avec `Device`
- **Index** :
  - `(user, device, syncAt)`
  - `status`

---

## 🧩 10. Journaux d’activité (`ActivityLog`)

- **Champs clés** : `_id`, `user`, `action`, `targetType`, `targetId`, `success`
- **Relations** :
  - N → 1 avec `User`
  - Variable selon `targetType`
- **Index** :
  - `(user, action, createdAt)`
  - `isDeleted`
- **Soft delete** :
  - `isDeleted`, `deletedAt`

---

### 🔗 Relations transversales

| Source   | Cible         | Type  | Description                                                 |
| -------- | ------------- | ----- | ----------------------------------------------------------- |
| `User`   | `Roman`       | 1 → N | Un utilisateur peut publier plusieurs romans                |
| `User`   | `Comment`     | 1 → N | Un utilisateur peut poster plusieurs commentaires           |
| `Roman`  | `Comment`     | 1 → N | Un roman peut avoir plusieurs commentaires                  |
| `User`   | `Message`     | 1 → N | L’utilisateur peut envoyer ou recevoir des messages         |
| `User`   | `Device`      | 1 → N | Un utilisateur peut se connecter depuis plusieurs appareils |
| `User`   | `Feedback`    | 1 → N | Un utilisateur peut envoyer plusieurs feedbacks             |
| `User`   | `ActivityLog` | 1 → N | Toutes les actions sont tracées par utilisateur             |
| `Device` | `SyncData`    | 1 → N | Chaque appareil a ses cycles de synchronisation             |

---

### ⚙️ Indexation globale

- **Texte complet** :
  - `Roman.title`, `Roman.synopsis`, `Roman.tags[]`, `User.username`
- **Composés** :
  - `(romanId, parentId)` → hiérarchie des commentaires
  - `(user, roman)` → unicité des notes
  - `(user, device)` → cohérence des syncs
- **Filtrage courant** :
  - `isDeleted`, `status`, `language`, `visibility`, `createdAt`

---

### 🔒 Stratégie de suppression & audit

- **Soft delete** généralisé pour préserver l’intégrité référentielle.
- Aucun `deleteOne()` direct : toutes les suppressions passent par des méthodes `softDelete()`.
- Les champs `deletedAt`, `deletedBy`, `reviewedBy` et `flagged` permettent la traçabilité complète des actions.

---

### 📊 Diagramme conceptuel simplifié

User ──┬──< Roman >──┬──< Comment >
│ └──< Rating >
├──< Message >── User
├──< Device >──< SyncData >
├──< Feedback >
└──< ActivityLog >

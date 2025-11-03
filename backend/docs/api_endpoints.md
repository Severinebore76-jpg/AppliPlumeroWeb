# 🧩 API Endpoints — Authentification & Utilisateurs

---

## 🔐 Authentification

### ➕ POST /api/auth/register

**Description :** Crée un nouvel utilisateur.

**Body JSON :**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Secret123!"
}
**Réponse :**
{
  "success": true,
  "token": "<jwt_token>",
  "user": {
    "_id": "65fa…",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "user"
  }
}

---

### **🔑 POST /api/auth/login**



Authentifie un utilisateur existant.



**Body JSON :**

{
  "email": "jane@example.com",
  "password": "Secret123!"
}

**Réponse :**
{
  "success": true,
  "token": "<jwt_token>",
  "user": {
    "_id": "65fa…",
    "email": "jane@example.com",
    "role": "user"
  }
}

---

### **🧩 GET /api/auth/verify**



Vérifie le token JWT et retourne la session active.



**Headers :**

Authorization: Bearer <jwt_token>



**Réponse :**

{
  "success": true,
  "user": {
    "_id": "65fa…",
    "email": "jane@example.com",
    "role": "user"
  }
}

---

## **👥 Utilisateurs**



### **🔍 GET /api/users/:id**



Récupère le profil public d’un utilisateur connecté.



**Headers :**

Authorization: Bearer <jwt_token>



**Réponse :**

{
  "success": true,
  "user": {
    "_id": "65fa…",
    "name": "Jane Doe",
    "avatarUrl": ""
  }
}

---

### **⚙️ PATCH /api/users/:id**



Met à jour le profil utilisateur.



**Body JSON :**

{
  "name": "Jane D.",
  "avatarUrl": "/uploads/avatar123.png"
}

**Réponse :**

{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "user": {
    "_id": "65fa…",
    "name": "Jane D.",
    "avatarUrl": "/uploads/avatar123.png"
  }
}

---

### **🚫 DELETE /api/users/:id**



Supprime le compte utilisateur (auth requis).



**Headers :**

Authorization: Bearer <jwt_token>



**Réponse :**

{
  "success": true,
  "message": "Compte supprimé avec succès"
}
```

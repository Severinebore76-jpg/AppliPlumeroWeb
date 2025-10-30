# 📚 API — Romans & Comments

## ⚙️ Structure REST complète

```bash
/api
├── /auth                      → Authentification & création de compte
├── /users                     → Gestion des utilisateurs
├── /romans                    → Gestion des romans
│    ├── GET    /              → Liste paginée des romans (publique)
│    ├── GET    /:slug         → Détail d’un roman via son slug (publique)
│    ├── POST   /              → Créer un roman (user connecté)
│    ├── PUT    /:id           → Modifier un roman (owner/admin)
│    ├── DELETE /:id           → Supprimer un roman (owner/admin)
│    │
│    └── /:romanId/comments    → Gestion des commentaires d’un roman
│          ├── GET    /        → Lister les commentaires approuvés d’un roman (publique)
│          ├── POST   /        → Ajouter un commentaire (user connecté)
│          ├── PUT    /:id     → Modifier un commentaire (owner/admin)
│          ├── DELETE /:id     → Supprimer un commentaire (owner/admin)
│
└── /health                    → Vérifie l’état du serveur (ping API)

🧩 Middleware

Route
Middleware appliqué
Description
POST /api/romans
protect
Requiert un utilisateur connecté
PUT /api/romans/:id
protect
Owner ou admin uniquement
DELETE /api/romans/:id
protect
Owner ou admin uniquement
POST /api/romans/:romanId/comments
protect
Authentification obligatoire
PUT /api/romans/:romanId/comments/:id
protect
Owner ou admin
DELETE /api/romans/:romanId/comments/:id
protect
Owner ou admin

💬 Exemples de requêtes
➕ Créer un roman
POST /api/romans
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Le carnet oublié",
  "summary": "Mystère entre deux époques",
  "tags": ["mystère", "drame"],
  "status": "draft"
}

💬 Ajouter un commentaire
POST /api/romans/66f32df2a8b7d9e4a/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "J’ai adoré ce passage, l’ambiance est incroyable."
}
🔎 Lister les commentaires d’un roman

GET /api/romans/66f32df2a8b7d9e4a/comments?page=1&limit=10.

Réponse {
  "results": [
    {
      "_id": "66f342ccafc1b2b5d1",
      "text": "J’ai adoré ce passage...",
      "author": { "name": "Séverine" },
      "createdAt": "2025-10-26T20:04:00Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 34,
  "totalPages": 4
}

⸻

✅ En résumé
• Romans → entité principale (contenu littéraire).
• Comments → sous-ressource dépendante de Roman.
• Structure REST hiérarchisée et extensible.
• Pagination, modération, sécurité et cohérence entre modules.

⸻

© 2025 – AppliPlumeroWeb | Documentation technique interne
```

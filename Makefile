# ============================================
# 🚀 AppliPlumeroWeb — Makefile
# Automatisation des tâches (Docker, NPM, Tests)
# ============================================

# Variables globales
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend

# -----------------------------
# ⚙️ Commandes de base
# -----------------------------

# Lancer le projet complet (Docker)
up:
	$(DOCKER_COMPOSE) up -d

# Stopper et nettoyer les conteneurs
down:
	$(DOCKER_COMPOSE) down

# Rebuild complet du projet (images Docker)
rebuild:
	$(DOCKER_COMPOSE) build --no-cache

# -----------------------------
# 🧱 Backend
# -----------------------------

# Lancer le serveur backend localement
run-backend:
	cd $(BACKEND_DIR) && npm run dev

# Installer les dépendances backend
install-backend:
	cd $(BACKEND_DIR) && npm install

# -----------------------------
# 💻 Frontend
# -----------------------------

# Lancer le serveur frontend localement
run-frontend:
	cd $(FRONTEND_DIR) && npm run dev

# Builder le frontend
build-frontend:
	cd $(FRONTEND_DIR) && npm run build

# -----------------------------
# 🧪 Tests
# -----------------------------

test:
	cd $(BACKEND_DIR) && npm test

# -----------------------------
# 🧹 Nettoyage
# -----------------------------

clean:
	rm -rf $(BACKEND_DIR)/node_modules $(FRONTEND_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/dist
	$(DOCKER_COMPOSE) down -v --remove-orphans
# Makefile for Docker-based full-stack project
# 
# Usage:
#   make dev   → start development environment (hot reload for backend & frontend)
#   make prod  → start production environment (optimized builds, frontend served via nginx)
#   make down  → stop all containers and remove volumes

.PHONY: dev prod down

# --------------------------
# Start development environment
# --------------------------
dev:
	@echo "Starting development environment..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:5000"
	docker compose -f docker-compose.dev.yml up --build

# --------------------------
# Start production environment
# --------------------------
prod:
	@echo "Starting production environment..."
	@echo "Frontend: http://localhost:3000 (served by nginx)"
	@echo "Backend:  http://localhost:5000"
	docker compose -f docker-compose.prod.yml up --build

# --------------------------
# Stop all containers and remove volumes
# --------------------------
down:
	@echo "Stopping all containers and removing volumes..."
	docker compose -f docker-compose.dev.yml down -v
	docker compose -f docker-compose.prod.yml down -v

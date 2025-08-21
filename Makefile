# Makefile for Contact Manager
# Usage:
#   make dev            -> run full stack (frontend+backend+db+redis+listener)
#   make dev-detach     -> same as dev, but in background
#   make restart        -> rebuild & restart detached
#   make down           -> stop and remove containers + volumes
#   make logs           -> tail logs for all services
#   make logs-backend   -> tail backend logs only
#   make logs-frontend  -> tail frontend logs only
#   make ps             -> show container status
#   make backend        -> run backend only (local, no docker)
#   make frontend       -> run frontend only (local, no docker)
#   make listener       -> run listener only (local, no docker)
#   make help           -> show this help

.PHONY: dev dev-detach restart down logs logs-backend logs-frontend ps backend frontend listener help

COMPOSE := docker compose -f docker-compose.dev.yml
FRONTEND_URL := http://localhost:5173
BACKEND_URL  := http://localhost:3001

help:
	@echo "Contact Manager - commands:"
	@echo "  make dev           - start dev stack (Docker)"
	@echo "  make dev-detach    - start dev stack in background"
	@echo "  make restart       - rebuild + restart detached"
	@echo "  make down          - stop & remove containers and volumes"
	@echo "  make logs          - tail logs for all services"
	@echo "  make logs-backend  - tail backend logs only"
	@echo "  make logs-frontend - tail frontend logs only"
	@echo "  make ps            - show container status"
	@echo "  make backend       - run backend locally (no Docker)"
	@echo "  make frontend      - run frontend locally (no Docker)"
	@echo "  make listener      - run listener locally (no Docker)"

dev:
	@echo "Starting development environment..."
	@echo "Frontend: $(FRONTEND_URL)"
	@echo "Backend:  $(BACKEND_URL)"
	$(COMPOSE) up --build

dev-detach:
	@echo "Starting development environment (detached)..."
	@echo "Frontend: $(FRONTEND_URL)"
	@echo "Backend:  $(BACKEND_URL)"
	$(COMPOSE) up --build -d

restart:
	@echo "Rebuilding and restarting (detached)..."
	$(COMPOSE) down
	$(COMPOSE) up --build -d

down:
	@echo "Stopping all containers and removing volumes..."
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f cm_frontend

ps:
	$(COMPOSE) ps

# Local (no Docker) helpers — assumes you have Postgres & Redis running locally
backend:
	cd backend && npm install && npm run dev

frontend:
	cd frontend && npm install && npm run dev

listener:
	cd backend && npm install && npm run listener

.PHONY: help build up down restart logs db-migrate seed clean test

# Default target
help:
	@echo "═══════════════════════════════════════════════════════"
	@echo " CyberOracle Command Center"
	@echo "═══════════════════════════════════════════════════════"
	@echo "Usage:"
	@echo "  make up          - Start the entire SOC platform (detached)"
	@echo "  make down        - Stop the platform"
	@echo "  make build       - Rebuild all Docker containers"
	@echo "  make logs        - Tail logs for all services"
	@echo "  make db-migrate  - Run Alembic database migrations"
	@echo "  make seed        - Seed database with realistic threat data"
	@echo "  make clean       - Remove all containers, networks, and volumes"
	@echo "═══════════════════════════════════════════════════════"

build:
	cd infra && docker compose build

up:
	cd infra && docker compose up -d
	@echo "CyberOracle is booting..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend API: http://localhost:8000"

down:
	cd infra && docker compose down

restart: down up

logs:
	cd infra && docker compose logs -f

db-migrate:
	cd infra && docker compose exec backend alembic upgrade head

seed:
	cd infra && docker compose exec backend python scripts/seed_data.py

clean:
	cd infra && docker compose down -v
	@echo "Environment completely wiped."

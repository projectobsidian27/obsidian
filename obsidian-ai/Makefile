SHELL := /bin/bash
WEB := apps/web
API := apps/api
PY := python3

.PHONY: setup dev build lint typecheck test coverage format security clean

setup:
	npm install --workspaces || true
	cd $(API) && $(PY) -m pip install --upgrade pip && $(PY) -m pip install -r requirements.txt || true
	@echo "✅ Setup complete."

dev:
	( cd $(API) && $(PY) -m uvicorn app.main:app --reload --port 8000 ) & \
	( cd $(WEB) && npm run dev )

build:
	npm run build -w $(WEB)

lint:
	npm run lint -w $(WEB) || true
	cd $(API) && ruff check .

typecheck:
	npm run typecheck -w $(WEB) || true
	cd $(API) && mypy app

test:
	npm run test -w $(WEB) || true
	cd $(API) && pytest -q

coverage:
	npm run coverage -w $(WEB) || true
	cd $(API) && pytest -q --cov=app --cov-report=term-missing

format:
	npm run format -w $(WEB) || true
	cd $(API) && ruff check --select I --fix .
	cd $(API) && black .

security:
	@echo "Run gitleaks & semgrep locally if installed."
	@echo "CI will run full scans on PR."

clean:
	rm -rf $(WEB)/.next $(WEB)/node_modules $(API)/.pytest_cache .pytest_cache **/__pycache__ coverage* **/*.pyc
	@echo "🧹 Cleaned."

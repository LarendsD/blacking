setup: install db-migrate

install:
	npm install

db-generate:
	npm run typeorm -- migration:generate src/common/migrations/migrations -d src/data-source.ts

db-migrate:
	npm run typeorm -- migration:run -d src/data-source.ts

db-drop:
	npm run typeorm -- migration:revert -d src/data-source.ts

run-test:
	npm run test:e2e

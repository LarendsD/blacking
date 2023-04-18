setup: install db-migrate

install:
	npm install

db-generate:
	npm run typeorm -- migration:generate ./backend/src/common/migrations/migrations -d ./backend/src/data-source.ts

db-migrate:
	npm run typeorm -- migration:run -d ./backend/src/data-source.ts

db-drop:
	npm run typeorm -- migration:revert -d ./backend/src/data-source.ts

run-test:
	npm run test:e2e
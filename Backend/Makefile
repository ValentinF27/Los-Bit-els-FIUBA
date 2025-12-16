.PHONY: db run start stop deps

db:
	docker compose up -d

run:
	npm run dev

start: db run

stop:
	docker compose down

deps:
	npm install

enter_db:
	docker compose exec db psql -U postgres Bit-els

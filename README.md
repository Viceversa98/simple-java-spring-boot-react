# Simple Kanban Board (React + Spring Boot + PostgreSQL)

A complete, small Kanban app with three columns (**To Do**, **In Progress**, **Done**),
card CRUD, drag-and-drop (plus Move buttons), and PostgreSQL persistence.

## Project layout

```
simple-java-spring-boot-react/
  backend/     Spring Boot 3.x (Java 21) REST API on :8080
  frontend/    React + Vite + TypeScript UI on :5173
  docker-compose.yml   Optional Postgres container
  README.md
  STATUS.md    Runtime notes after local bring-up
```

## Prerequisites

- OpenJDK 21
- Maven 3.9+
- Node.js 18+ / npm
- PostgreSQL 14+ **or** Docker (for `docker compose`)

## Database setup

### Option A — local PostgreSQL (used on this Linux box)

```bash
sudo pg_ctlcluster 17 main start   # or: sudo service postgresql start
sudo -u postgres psql -c "CREATE ROLE kanban WITH LOGIN PASSWORD 'kanban';" || true
sudo -u postgres createdb -O kanban kanban || true
sudo -u postgres psql -d kanban -c "GRANT ALL ON SCHEMA public TO kanban;"
```

Connection (also in `backend/src/main/resources/application.yml`):

- URL: `jdbc:postgresql://localhost:5432/kanban`
- User / password: `kanban` / `kanban`

### Option B — Docker Postgres

```bash
docker compose up -d
```

## Run backend

```bash
cd backend
mvn spring-boot:run
```

API base: `http://localhost:8080/api/cards`

On first start with an empty DB, `DataSeeder` inserts sample cards.

## Run frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open: `http://localhost:5173`

## Sample API calls

```bash
# List cards
curl -s http://localhost:8080/api/cards | jq .

# Create a card
curl -s -X POST http://localhost:8080/api/cards \
  -H 'Content-Type: application/json' \
  -d '{"title":"Ship the demo","description":"Show the board","status":"TODO"}'

# Move a card (id=1 → Done at position 0)
curl -s -X PATCH http://localhost:8080/api/cards/1/move \
  -H 'Content-Type: application/json' \
  -d '{"status":"DONE","position":0}'

# Delete
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://localhost:8080/api/cards/1
```

## Features

- Columns: To Do, In Progress, Done
- Cards: id, title, description, status, position, createdAt
- Create / edit / delete
- Drag-drop between columns + Move buttons
- CORS enabled for `http://localhost:5173`
- Seed data when the database is empty

## Stopping

See `STATUS.md` for PIDs/ports used on a given machine. Typical:

```bash
# Frontend / backend: Ctrl+C in their terminals, or kill by port:
fuser -k 8080/tcp 5173/tcp
```

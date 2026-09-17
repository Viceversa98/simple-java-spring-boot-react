# Kanban app — runtime STATUS

Generated: Fri Sep 18, 2026 ~00:52 AM (Asia/Kuala_Lumpur, UTC+8)

## Paths

| Item | Path |
|------|------|
| Project root | `/workspace/simple-java-spring-boot-react` |
| Backend | `/workspace/simple-java-spring-boot-react/backend` |
| Frontend | `/workspace/simple-java-spring-boot-react/frontend` |
| Tarball | `/workspace/simple-java-spring-boot-react.tar.gz` |
| Backend log | `/tmp/kanban-backend.log` |
| Frontend log | `/tmp/kanban-frontend.log` |

## Ports (running on this Linux box)

| Service | Port | Bind | Process notes |
|---------|------|------|---------------|
| PostgreSQL 17 | **5432** | localhost | cluster `17/main` |
| Spring Boot API | **8080** | all interfaces | Java `KanbanApplication` |
| Vite React UI | **5173** | `0.0.0.0` | `npm run dev` / Vite |

- UI: http://localhost:5173/
- API: http://localhost:8080/api/cards

## Database

- DB: `kanban`
- User / password: `kanban` / `kanban`
- JDBC: `jdbc:postgresql://localhost:5432/kanban`
- Seed: `DataSeeder` inserted 5 sample cards on first empty start

## Verified smoke tests

```text
GET  http://localhost:8080/api/cards  → 200, seeded cards (then 6 after create)
POST http://localhost:8080/api/cards  → 201, id=6 "Verify create works"
GET  http://localhost:5173/          → 200
```

Sample list titles after seed + create:
- Choose the stack (DONE)
- Build the API / Design the board UI (IN_PROGRESS)
- Welcome to Kanban / Set up the project / Verify create works (TODO)

## How to stop

```bash
# Kill by port (recommended)
fuser -k 8080/tcp 5173/tcp

# Or by process name
pkill -f 'KanbanApplication' || true
pkill -f 'vite --host 0.0.0.0 --port 5173' || true

# Postgres (only if you want to stop the DB too)
sudo pg_ctlcluster 17 main stop
```

## How to restart

```bash
# Postgres
sudo pg_ctlcluster 17 main start

# Backend
cd /workspace/simple-java-spring-boot-react/backend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
nohup mvn -q spring-boot:run > /tmp/kanban-backend.log 2>&1 &

# Frontend
cd /workspace/simple-java-spring-boot-react/frontend
nohup npm run dev -- --host 0.0.0.0 --port 5173 > /tmp/kanban-frontend.log 2>&1 &
```

## Issues / notes

- Cloud GitHub agent was blocked earlier; this stack was built directly on the box instead.
- OpenJDK 21, Maven 3.9.9, and PostgreSQL 17 were installed via apt during bring-up.
- Minor Hibernate warning: explicit `PostgreSQLDialect` in `application.yml` is optional (safe to ignore).
- Postgres currently listens on localhost only (fine for local app on this box).
- Tarball excludes `node_modules/` and `backend/target/` — run `npm install` and `mvn spring-boot:run` after unpacking on Windows (use Docker Compose for Postgres there if needed).

## Windows transfer hint

Copy `/workspace/simple-java-spring-boot-react.tar.gz` to the Windows machine, extract, then:

1. `docker compose up -d` (or install local Postgres with same credentials)
2. `cd backend && mvn spring-boot:run`
3. `cd frontend && npm install && npm run dev`

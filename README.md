# Contact Manager

## Overview

Contact Manager is a full-stack JavaScript project with:

* **Backend:** Node.js (Express)
* **Frontend:** React
* **Database:** PostgreSQL

The project is fully containerized with Docker. All services (backend, frontend, and database) are included, so no additional setup is required.

---

## Folder Structure

```
contact-manager/
│
├── backend/         # Node.js backend
├── frontend/        # React frontend
├── db-init/         # SQL scripts for initial database setup
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── Makefile
├── .env.example
└── README.md
```

---

## Setup Instructions

### 1. Requirements

* Docker and Docker Compose installed ([https://www.docker.com/get-started](https://www.docker.com/get-started))
* No local Node.js or Postgres installation required

---

### 2. Environment Variables

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

---

### 3. Start Development Environment

This mode enables **hot reload** for backend and frontend.

```bash
make dev
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend:** [http://localhost:5000](http://localhost:5000)
* Database tables are automatically created from `db-init/init.sql`

---

### 4. Start Production Environment

This mode uses **optimized builds**:

* React is built and served via nginx
* Backend runs in production mode
* Database schema is created automatically if volume is empty

```bash
make prod
```

* **Frontend:** [http://localhost:3000](http://localhost:3000)
* **Backend:** [http://localhost:5000](http://localhost:5000)

---

### 5. Stop All Services

```bash
make down
```

**Note:** Removing volumes will reset the database, so tables will be re-created on next startup.

---

### 6. Database Info

* **Host:** `db`
* **Port:** `${POSTGRES_PORT}`
* **User:** `${POSTGRES_USER}`
* **Password:** `${POSTGRES_PASSWORD}`
* **DB Name:** `${POSTGRES_DB}`

Tables are created on first run from `db-init/init.sql`.

---

### 7. Quick Reference

| Command     | Description                              |
| ----------- | ---------------------------------------- |
| `make dev`  | Start dev environment (hot reload)       |
| `make prod` | Start prod environment (optimized build) |
| `make down` | Stop containers and remove volumes       |

---

### Notes

* Just unzip and run `make prod` to see the project in action.
* No additional installations or configuration required.
* Database schema is ready on first run.

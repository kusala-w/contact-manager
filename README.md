# Contact Manager

A small full-stack app built with **React + Node/Express + PostgreSQL + Redis + Socket.IO**.  
Features:

- CRUD contacts (first name, last name, email, phone).
- Simulated **slow API (20s delay)** on contact creation.
- Edit history tracked via **Postgres trigger** and **listener service**.
- Real-time updates across clients using **Redis pub/sub + Socket.IO**.
- Pagination, duplicate email validation, and delete confirmation.

---

## 📦 Prerequisites

- **Node.js 22+** (recommended: install with [nvm](https://github.com/nvm-sh/nvm))
- **Docker & Docker Compose** (for containerized setup)
- **PostgreSQL 16** & **Redis** (only required if running locally without Docker)

---

## ⚙️ Environment Variables

Root `.env` (used by backend & Docker):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=contact-manager-db
POSTGRES_PORT=5434
POSTGRES_INTERNAL_PORT=5432
POSTGRES_HOST=db

BACKEND_PORT=3001
NODE_ENV=development

REDIS_HOST=redis
REDIS_PORT=6379
```

Frontend `.env` (in `frontend/`):

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
VITE_CONTACT_UPDATES_CHANNEL=contact-updates
```

> 💡 **Running locally without Docker?**
> - Change `POSTGRES_HOST=localhost` and `REDIS_HOST=localhost` in root `.env`.
> - Ensure Postgres is running on port `5434` (or adjust as needed).
> - Run `/db-init/init.sql` manually to initialize schema.

---

## 🚀 Run with Docker

Start everything:

```bash
make dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)  
- Backend: [http://localhost:3001](http://localhost:3001)

Stop & remove everything (containers + volumes):

```bash
make down
```

Tail logs:

```bash
make logs
```

---

## 🖥️ Run Locally (no Docker)

Make sure **Postgres** and **Redis** are running locally. Example (macOS/Homebrew):

```bash
brew services start postgresql@16
brew services start redis
```

Backend + listener:

```bash
cd backend
npm install
npm run dev       # server on http://localhost:3001
npm run listener  # pg/redis listener
```

Frontend:

```bash
cd frontend
npm install
npm run dev       # vite on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔍 Features to Test

1. **Create Contact (delayed 20s)**  
   - Click **+ New Contact**, fill fields → buttons disabled + spinner.  
   - After ~20s, record appears.

2. **Edit Contact**  
   - Click ✎ → update field → Save.  
   - Row updates, and **History (⏱️)** shows changes.

3. **Real-time Updates**  
   - Open two tabs.  
   - Edit a contact in tab A → tab B updates instantly.

4. **Duplicate Email Check**  
   - Try creating a contact with an existing email → validation error on submit.

5. **Pagination**  
   - If >10 records, use **Previous / Next** to navigate.

6. **Delete with Confirmation**  
   - Click 🗑️ → confirm → record removed.

7. **Listener Verification**  
   - Run `make logs` → see `cm_listener` and `cm_backend` messages when CRUD happens.

---

## 🛠️ Developer Commands (Makefile)

```bash
make dev         # start dev stack (docker)
make down        # stop & remove all
make logs        # follow logs

make backend     # run backend locally
make frontend    # run frontend locally
make listener    # run listener locally
```

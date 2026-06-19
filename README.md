# Mini Job Application Tracker

A full-stack web app for tracking job applications through the hiring pipeline — from Applied to Offer (or Rejection).

![screenshot](https://via.placeholder.com/800x450?text=Screenshot+coming+soon)

## Features

- **CRUD** — Add, edit, delete job applications
- **Filter** by status (Applied / Interviewing / Offer / Rejected)
- **Search** by company name or job title
- **Sortable table** — click any column header to sort
- **Pagination** — server-side, 10 per page
- **Optimistic updates** — edits and deletes reflect instantly, roll back on error
- **Dark mode** — toggle in the header
- **Validation** — client-side (form) + server-side (Zod) + database (CHECK constraints)
- **Responsive UI** — works on mobile and desktop

## Tech Stack

| Layer      | Technology                                                   |
| ---------- | ------------------------------------------------------------ |
| Frontend   | React 19, TypeScript, Vite 8, Tailwind CSS v4, TanStack Query, TanStack Table |
| Backend    | Node.js, Express, TypeScript, Zod                            |
| Database   | PostgreSQL 16                                                |
| Testing    | Vitest (frontend), Jest (backend)                            |
| DevOps     | Docker, Docker Compose                                       |

## Quick Start (Docker)

```bash
git clone <repo-url>
cd mini-jat-fullstack
docker compose up -d
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

Migrations run automatically. If you want seed data:

```bash
docker compose exec backend node scripts/seed.mjs
```

## Development (without Docker)

### Backend

```bash
cd mini-jat-backend
cp .env.example .env       # edit DATABASE_URL if needed
npm install
npm run migrate            # create tables
npm run dev                # hot reload on :3001
```

### Frontend

```bash
cd mini-jat-frontend
npm install
npm run dev                # proxies API to :3001, served on :5173
```

## Running Tests

```bash
# Backend
cd mini-jat-backend && npm test

# Frontend
cd mini-jat-frontend && npm test
```

## API Overview

| Method   | Endpoint              | Description           |
| -------- | --------------------- | --------------------- |
| `GET`    | `/applications`       | List (paginated, filterable) |
| `GET`    | `/applications/:id`   | Get one               |
| `POST`   | `/applications`       | Create                |
| `PATCH`  | `/applications/:id`   | Partial update        |
| `DELETE` | `/applications/:id`   | Delete                |
| `GET`    | `/health`             | Health check          |

See the [backend README](mini-jat-backend/README.md) for full API docs.

## Environment Variables

### Backend (`mini-jat-backend/.env`)

| Variable       | Default                                                    |
| -------------- | ---------------------------------------------------------- |
| `PORT`         | `3001`                                                     |
| `DATABASE_URL` | `postgresql://jat_user:jat_password@localhost:5432/jat_db` |

### Frontend (`mini-jat-frontend/.env`)

| Variable       | Default | Description                              |
| -------------- | ------- | ---------------------------------------- |
| `VITE_API_URL` | (empty) | API origin (empty = Vite proxy in dev)   |

## Project Structure

```
mini-jat-fullstack/
├── docker-compose.yml
├── mini-jat-backend/
│   ├── Dockerfile
│   ├── src/              # Express API
│   ├── tests/            # Jest tests
│   └── scripts/          # Seed script
├── mini-jat-frontend/
│   ├── Dockerfile
│   ├── src/              # React app
│   └── tests/            # Vitest tests
└── .gitignore
```

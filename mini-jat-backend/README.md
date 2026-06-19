# Mini Job Application Tracker - Backend API

A RESTful API for tracking job applications through different hiring stages, built with Express + TypeScript + PostgreSQL.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose
- **Validation**: Zod
- **Testing**: Jest + ts-jest

## Prerequisites

- Docker & Docker Compose

## Getting Started

### Quick start (recommended)

```bash
# 1. Start PostgreSQL and the API server
docker compose up -d

# 2. Run database migrations (first time setup)
docker compose exec app node dist/migrations/run.js
```

This builds the backend image, starts the API server on port 3001, and PostgreSQL on port 5432.

> **Why are migrations separate?** Running schema changes automatically on server start is risky — you want explicit control over when the database changes. This follows production best practices where migrations are a distinct deploy step.

### Development mode (with hot reload)

```bash
# 1. Start just the database
docker compose up -d db

# 2. Install dependencies
npm install

# 3. Copy env
cp .env.example .env

# 4. Run migrations
npm run migrate

# 5. Start dev server with hot reload
npm run dev
```

## API Endpoints

### List all applications

```
GET /applications
```

Query parameters (all optional):

| Param    | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| status   | string | Filter by status (`Applied`, `Interviewing`, `Offer`, `Rejected`) |
| search   | string | Search by company name or job title (ILIKE)    |
| page     | number | Page number (default: 1)                       |
| limit    | number | Items per page (default: 20, max: 100)         |

**Response:**
```json
{
  "data": [ ... ],
  "total": 10,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### Get a single application

```
GET /applications/:id
```

### Create an application

```
POST /applications
```

**Body:**
```json
{
  "company_name": "Google",
  "job_title": "Software Engineer",
  "job_type": "Full-time",
  "status": "Applied",
  "applied_date": "2026-06-01",
  "notes": "Optional notes"
}
```

### Update an application (partial)

```
PATCH /applications/:id
```

Accepts any subset of the create fields.

### Delete an application

```
DELETE /applications/:id
```

Returns `204 No Content` on success.

## Health Check

```
GET /health
```

## Running Tests

```bash
npm test
```

## Environment Variables

| Variable       | Description                | Default                                                          |
| -------------- | -------------------------- | ---------------------------------------------------------------- |
| `PORT`         | Server port                | `3001`                                                           |
| `DATABASE_URL` | PostgreSQL connection URL  | `postgresql://jat_user:jat_password@localhost:5432/jat_db` |

> **Note:** When using `docker compose up -d`, the app container uses `postgresql://jat_user:jat_password@db:5432/jat_db` (hostname `db` = the service name in docker-compose.yml).

## Project Structure

```
├── Dockerfile                    # Multi-stage production build
├── docker-compose.yml            # App + PostgreSQL services
├── src/
│   ├── index.ts                  # Express app entry point
│   ├── config/
│   │   └── database.ts           # PostgreSQL connection pool
│   ├── controllers/
│   │   └── applicationController.ts  # Route handlers
│   ├── middlewares/
│   │   ├── errorHandler.ts       # Error handling middleware
│   │   └── validation.ts         # Zod validation middleware
│   ├── migrations/
│   │   └── run.ts                # Migration runner
│   ├── routes/
│   │   └── applications.ts       # Route definitions + Zod schemas
│   └── types/
│       └── index.ts              # TypeScript type definitions
└── tests/
    └── applications.test.ts      # Unit tests
```

## Design Decisions

- **PostgreSQL with raw SQL (no ORM)** — Keeps dependencies minimal and gives full control over queries.
- **Zod for validation** — Schema-based validation with excellent TypeScript inference, works for both request validation and testing.
- **Migration runner** — Lightweight, no external migration tool needed. Tracks run migrations in a `_migrations` table.
- **Pagination** — Built into the list endpoint with configurable `page`/`limit` params.
- **Search** — Case-insensitive ILIKE search across company name and job title.

# Mini Job Application Tracker — Backend API

Express + TypeScript + PostgreSQL REST API for tracking job applications.

## Tech Stack

- **Node.js** with **Express**
- **TypeScript** (strict mode)
- **PostgreSQL 16**
- **Zod** for request validation
- **Jest** + **ts-jest** for tests
- **Docker** + Docker Compose

## Getting Started

### With Docker (recommended)

```bash
docker compose up -d
```

This starts PostgreSQL and the API server on port 3001. Migrations run automatically on startup.

### Without Docker

```bash
# Start PostgreSQL on your own, then:
npm install
npm run migrate    # create tables
npm run dev        # hot reload on port 3001
```

## Seed Data

```bash
node scripts/seed.mjs
```

Creates 50 random applications (requires backend running on port 3001).

## API Endpoints

| Method  | Endpoint              | Auth | Description          |
| ------- | --------------------- | ---- | -------------------- |
| `GET`   | `/health`             | —    | Health check         |
| `GET`   | `/applications`       | —    | List applications    |
| `GET`   | `/applications/:id`   | —    | Get one application  |
| `POST`  | `/applications`       | —    | Create application   |
| `PATCH` | `/applications/:id`   | —    | Update application   |
| `DELETE`| `/applications/:id`   | —    | Delete application   |

### GET /applications query params

| Param    | Type   | Description                                          |
| -------- | ------ | ---------------------------------------------------- |
| `status` | string | Filter: `Applied`, `Interviewing`, `Offer`, `Rejected` |
| `search` | string | ILIKE search on company_name and job_title           |
| `page`   | number | Page number (default: 1)                             |
| `limit`  | number | Items per page (default: 20, max: 100)               |

### Request/Response shapes

```
POST /applications
{
  "company_name": "Google",
  "job_title": "Software Engineer",
  "job_type": "Full-time",
  "status": "Applied",
  "applied_date": "2026-06-01",
  "notes": "Optional"
}

Response: 201
{
  "id": 1,
  "company_name": "Google",
  "job_title": "Software Engineer",
  "job_type": "Full-time",
  "status": "Applied",
  "applied_date": "2026-06-01",
  "notes": null,
  "created_at": "...",
  "updated_at": "..."
}
```

Validation errors return `400` with a message string. Not-found returns `404`. Everything else returns `500`.

## Project Structure

```
src/
├── index.ts                 # App entry, middleware setup
├── config/
│   └── database.ts          # PG pool + helpers
├── controllers/
│   └── applicationController.ts
├── lib/
│   └── schemas.ts           # Zod schemas + inferred types
├── middlewares/
│   ├── errorHandler.ts      # AppError + error/404 handlers
│   └── validation.ts        # Zod middleware (body, query, params)
├── migrations/
│   └── run.ts               # Runs SQL migrations, tracks in _migrations table
├── routes/
│   └── applications.ts      # Route definitions
└── types/
    └── index.ts              # Shared TS types
tests/
└── applications.test.ts     # Schema unit tests
scripts/
└── seed.mjs                 # Seed 50 random applications
```

## Environment Variables

| Variable       | Description               | Default                                                         |
| -------------- | ------------------------- | --------------------------------------------------------------- |
| `PORT`         | Server port               | `3001`                                                          |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://jat_user:jat_password@localhost:5432/jat_db` |

## Running Tests

```bash
npm test
```

## Design Notes

- **No ORM.** Raw SQL with parameterized queries keeps it simple and gives full control.
- **Zod** validates every request at the boundary — body, query params, and route params.
- **Migrations** run automatically on container start (see Dockerfile CMD). They're idempotent — already-run migrations are skipped.
- **Optimistic concurrency** isn't needed at this scale. The API uses simple read-then-write for updates and deletes.

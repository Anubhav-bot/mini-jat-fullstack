# Mini Job Application Tracker - Frontend

A full-stack mini job application tracker built with React, TypeScript, and modern tooling. This is the frontend client for the InternSathi FullStack Internship assignment.

## Tech Stack

- **Framework:** React 19 + TypeScript (strict mode)
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Data Fetching:** TanStack React Query v5
- **Table:** TanStack Table v8
- **HTTP Client:** Axios
- **Testing:** Vitest + React Testing Library
- **Icons:** Lucide React

## Features

- **Application List** — View all applications in a sortable, paginated table (10 per page)
- **Add Application** — Create new job applications with form validation
- **Edit Application** — Update existing application details, form auto-fills with current data
- **Delete Application** — Remove with confirmation dialog
- **Filter by Status** — Filter applications by Applied, Interviewing, Offer, Rejected
- **Search** — Search by company name or job title with debounced input (resets pagination)
- **View Details** — Quick-view modal for application details
- **Pagination** — Server-side pagination with Previous/Next controls and page counter
- **Loading States** — Spinner during data fetch
- **Error Handling** — Error state with retry option
- **Empty State** — User-friendly empty state message
- **Responsive UI** — Works on mobile and desktop with stable table layout

## Prerequisites

- Node.js 18+
- npm 9+
- Backend API running (see [Backend Setup](#backend-setup))

## Installation

```bash
git clone <repo-url>
cd mini-jat-frontend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` (defaults work out of the box):

```
VITE_API_URL=
```

In development, Vite's proxy forwards `/applications` and `/health` to `http://localhost:3001` — no CORS issues. For production, set `VITE_API_URL` to your API origin (e.g. `https://api.example.com`).

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The dev server proxies API requests to the backend (must be running on port 3001).

## Seed Data

```bash
node seed.mjs
```

Creates 50 random applications via the API (requires backend running).

## Build

```bash
npm run build
```

## Tests

```bash
npm run test        # single run
npm run test:watch  # watch mode
```

## Backend API

The frontend expects the following REST API endpoints:

| Method   | Endpoint              | Description             |
| -------- | --------------------- | ----------------------- |
| `GET`    | `/applications`       | List applications       |
| `GET`    | `/applications/:id`   | Get single application  |
| `POST`   | `/applications`       | Create application      |
| `PATCH`  | `/applications/:id`   | Update application      |
| `DELETE` | `/applications/:id`   | Delete application      |

### Query Parameters for GET /applications

- `status` — Filter by status (Applied, Interviewing, Offer, Rejected)
- `search` — Search by company name or job title
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)

### Application Data Model

```json
{
  "id": 1,
  "company_name": "Google",
  "job_title": "Software Engineer",
  "job_type": "Full-time",
  "status": "Applied",
  "applied_date": "2024-06-01",
  "notes": "Referral from friend",
  "created_at": "2024-06-01T00:00:00.000Z",
  "updated_at": "2024-06-01T00:00:00.000Z"
}
```

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   │   ├── badge-variants.ts
│   │   ├── badge.tsx
│   │   ├── button-variants.ts
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── textarea.tsx
│   ├── applications-page.tsx   # Main page with pagination & filter state
│   ├── application-form.tsx    # Add/Edit form with validation
│   ├── application-table.tsx   # TanStack Table (sortable, fixed-layout)
│   ├── confirm-delete.tsx      # Delete confirmation dialog
│   ├── empty-state.tsx         # Empty state placeholder
│   ├── error-state.tsx         # Error state with retry
│   ├── filter-bar.tsx          # Search + status filter
│   └── loading-spinner.tsx     # Loading indicator
├── hooks/
│   └── use-applications.ts     # React Query hooks
├── lib/
│   ├── api.ts                  # Axios API client
│   └── utils.ts                # cn() utility
├── tests/
│   └── applications-page.test.tsx
├── types/
│   └── application.ts
├── App.tsx
├── index.css
├── main.tsx
├── .env.example
├── seed.mjs                    # Seed 50 applications via API
└── vite.config.ts              # Proxy, Tailwind, path aliases, Vitest
```

## AI Usage

AI was used to scaffold the project, generate components, write tests, and ensure TypeScript correctness. Architecture decisions and code review were human-driven.

# Mini Job Application Tracker — Frontend

React + TypeScript frontend for tracking job applications.

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Vite 8** for dev server and builds
- **Tailwind CSS v4** with dark mode
- **TanStack React Query v5** for server state
- **TanStack Table v8** for the sortable table
- **Axios** for HTTP
- **Vitest** + React Testing Library for tests
- **Lucide** icons

## Getting Started

```bash
npm install
npm run dev        # starts on http://localhost:5173
```

The dev server proxies `/applications` and `/health` to `http://localhost:3001` (see `vite.config.ts`). Make sure the backend is running.

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm test`        | Run tests                |

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Low-level UI primitives
│   ├── applications-page.tsx  # Main page (state, fetching, dialogs)
│   ├── application-form.tsx   # Add/Edit form with client-side validation
│   ├── application-table.tsx  # Sortable table (TanStack Table)
│   ├── confirm-delete.tsx     # Delete confirmation modal
│   ├── empty-state.tsx        # "No data" placeholder
│   ├── error-state.tsx        # Error state with retry
│   ├── filter-bar.tsx         # Search + status dropdown
│   └── loading-spinner.tsx    # Loading indicator
├── hooks/
│   └── use-applications.ts    # React Query hooks (with optimistic updates)
├── lib/
│   ├── api.ts                 # Axios client
│   └── utils.ts               # cn() helper
├── types/
│   └── application.ts
├── tests/
│   └── applications-page.test.tsx
├── App.tsx
└── main.tsx
```

## Environment Variables

| Variable        | Description         | Default |
| --------------- | ------------------- | ------- |
| `VITE_API_URL`  | API base URL        | `` (uses Vite proxy in dev) |

## Features

- **CRUD** — Create, read, update, delete applications
- **Sortable columns** — Click column headers to sort
- **Filter by status** — Dropdown to filter the list
- **Search** — Debounced search by company / job title (resets pagination)
- **Pagination** — Server-side, 10 per page
- **Optimistic updates** — Edit/delete update the UI instantly, rollback on error
- **Dark mode** — Toggle in the header, persists to localStorage
- **Responsive** — Works on mobile and desktop
- **Error/loading/empty states** — Handled in every view
- **Delete confirmation** — Modal before deleting

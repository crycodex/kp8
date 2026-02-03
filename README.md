# Projects Dashboard

A mini dashboard for managing projects, built with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and navigate to **Projects** to start.

## Features

- **List projects** (`/projects`) — Table view with search by name or client, create button
- **Create project** (`/projects/new`) — Form with validation, success/error feedback
- **Project detail** (`/projects/[id]`) — Full project info, mark as Done

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Route Handlers for API

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/[id]` | Get project by ID |
| PATCH | `/api/projects/[id]` | Update project (e.g. status) |

## Persistence

- **Server**: Data is stored in `.data/projects.json` (file-based local storage). Route Handlers run on the server and cannot access browser LocalStorage.
- **Client**: API responses are synced to LocalStorage for faster loads and caching. On first load, cached data from LocalStorage is shown immediately when available.

## Technical Decisions

1. **File-based store on server**: Next.js Route Handlers execute on the server where LocalStorage does not exist. A JSON file (`.data/projects.json`) provides equivalent local persistence without a database.
2. **Client LocalStorage sync**: All API responses are written to LocalStorage so the client has a mirror of the data for instant display on subsequent visits.
3. **Validation**: Both client-side (form) and server-side (API) validation for name and client (min 2 chars).

## Future Improvements

- Status transitions (e.g. Planned → In progress → Done) instead of only "Mark as Done"
- Edit project form
- Delete project
- Pagination for large project lists
- Filters by status
- Dark/light mode toggle (currently follows system preference)

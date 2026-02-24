# Customer Support Tickets

Full-stack app with a React + Vite + TypeScript frontend and a Node.js + Express + TypeScript backend using **lowdb** (JSON file database).

## Stack

| Layer    | Tech                                     |
| -------- | ---------------------------------------- |
| Frontend | React 19, Vite 7, TypeScript             |
| Backend  | Node.js 22, Express 5, TypeScript, tsx   |
| Database | lowdb 7 (JSON file — `backend/data/db.json`) |

## Project structure

```
customer-support-tickets/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app entry point
│   │   ├── db.ts             # lowdb instance + types
│   │   └── routes/
│   │       └── tickets.ts    # Routes for /api/tickets
│   ├── data/                 # db.json lives here (gitignored by default)
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── .env                  # PORT, DB_PATH
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── types.ts
│   │   ├── api/
│   │   │   └── client.ts     # fetch wrapper + api object
│   │   └── components/
│   │       ├── Pagination/
│   │       ├── SkeletonCard/
│   │       └── TicketCard/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts        # proxies /api → http://localhost:3001
│   └── package.json
└── docker-compose.yml
```

## Getting started

### Local dev

**1. Backend**

```bash
cd backend
npm install
npm run dev          # starts on http://localhost:3001
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000). The Vite dev server proxies all `/api/*` requests to `http://localhost:3001`.

### Docker

Requires [Docker](https://docs.docker.com/get-docker/) with the Compose plugin.

```bash
docker compose up --build
```

- Frontend → [http://localhost:3000](http://localhost:3000)
- Backend  → [http://localhost:3001](http://localhost:3001)

The `backend/data/` directory is bind-mounted into the container so `db.json` persists across restarts. To stop:

```bash
docker compose down
```

## API reference

### `GET /api/tickets`

Returns a paginated list of tickets. Supports the following query parameters:

| Parameter | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `search`  | string | Filter by title (case-insensitive substring)     |
| `status`  | string | Filter by status: `open`, `pending`, or `closed` |
| `sort`    | string | Sort by `updatedAt`: `asc` or `desc` (default)  |
| `page`    | number | Page number (default: `1`, page size: 4)         |

Response shape:

```json
{
  "tickets": [...],
  "pagination": { "total": 20, "page": 1, "limit": 4, "totalPages": 5 }
}
```

### Other routes

| Method | Path               | Description                          |
| ------ | ------------------ | ------------------------------------ |
| GET    | `/api/tickets/:id` | Get a single ticket by id            |
| PATCH  | `/api/tickets/:id` | Update `title`, `description`, `priority`, `status`, or `customer` |
| DELETE | `/api/tickets/:id` | Delete a ticket                      |

### Ticket schema

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "priority": "low | medium | high",
  "status": "open | pending | closed",
  "customer": { "name": "string", "email": "string" },
  "updatedAt": "ISO 8601"
}
```

## Steps to improve if I would have more time

- Add a confirmation modal when deleting a ticket.
- Store the search text and filters in the query params of the frontend app and populate them when a user pastes the URL in a new tab. This massively improves UX when links are shared between users or when the user navigates with the browser's Back and Forward buttons.
- Add a separate ticket detail route with a comment section.
- Add authentication.
- Deploy on a real server.
- Add a small set of essential E2E tests.
- Add unit tests.
- Create a route or a separate frontend app for testing purposes — specifically to mock what a given API request will respond with.
- Add ESLint rules.

## AI development history

| File / Folder              | Contents                                                  |
| -------------------------- | --------------------------------------------------------- |
| `drafts.txt`               | Drafted prompts used when building this project with LLMs |
| `claude-code-chat-history/`| Conversation history from Claude Code sessions            |
| `cursor-chat-history/`     | Conversation history from Cursor AI agent sessions        |

## Build for production

```bash
# Backend
cd backend && npm run build    # output → backend/dist/
cd backend && npm start

# Frontend
cd frontend && npm run build   # output → frontend/dist/
```

## Trade-offs

- **CSS styles.** Given the time constraints and the limited scale of the project, simple LLM-generated CSS was used instead of a CSS or UI framework. For some components, style encapsulation based on component class names was applied — see the `components` folder. It is not the most robust solution, but at the current scale it is more than good enough.
- **No strict file separation.** Since the app is small, components, styles, and helper functions were kept in the same file when there were not enough of them to justify splitting things out.
- **No shared UI abstractions.** No generic button or input components were created, as there was not enough time and the number of occurrences did not warrant it.
- **LLM-driven development.** Given the time constraints and the number of features to deliver, this was the most efficient way to ship the maximum amount of functionality in the minimum amount of time.
- **No automated tests.** This is a significant omission, but given the time constraints, relying on manual testing felt the most appropriate for the current scope.
- **lowdb as the database.** Given the requirements, `lowdb` was used as the database — essentially reading and writing a `.json` file on every CRUD operation. With larger datasets, indexing and caching would be needed.

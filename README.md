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

## Build for production

```bash
# Backend
cd backend && npm run build    # output → backend/dist/
cd backend && npm start

# Frontend
cd frontend && npm run build   # output → frontend/dist/
```

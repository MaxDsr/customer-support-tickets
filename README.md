# Customer Support Tickets

Full-stack app with a React + Vite + TypeScript frontend and a Node.js + Express + TypeScript backend using **lowdb** (JSON file database).

## Stack

| Layer    | Tech                                     |
| -------- | ---------------------------------------- |
| Frontend | React 19, Vite 7, TypeScript             |
| Backend  | Node.js 20+, Express 5, TypeScript, tsx  |
| Database | lowdb 7 (JSON file — `backend/data/db.json`) |

## Project structure

```
customer-support-tickets/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app entry point
│   │   ├── db.ts             # lowdb instance + types
│   │   └── routes/
│   │       └── tickets.ts    # CRUD routes for /api/tickets
│   ├── data/                 # db.json lives here (gitignored by default)
│   ├── .env                  # PORT, DB_PATH
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   ├── types.ts
    │   └── api/
    │       └── client.ts     # fetch wrapper + api object
    ├── public/
    ├── index.html
    ├── vite.config.ts        # proxies /api → http://localhost:3001
    └── package.json
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
npm run dev          # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev          # starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000). The Vite dev server proxies all `/api/*` requests to `http://localhost:3001`.

## API reference

| Method | Path                  | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/tickets`        | List all tickets      |
| GET    | `/api/tickets/:id`    | Get ticket by id      |
| POST   | `/api/tickets`        | Create a ticket       |
| PATCH  | `/api/tickets/:id`    | Update title/desc/status |
| DELETE | `/api/tickets/:id`    | Delete a ticket       |

### Ticket schema

```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "status": "open | in_progress | resolved",
  "createdAt": "ISO 8601",
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

IQT-FSD-2026

# Task Manager (Full Stack Coding Assessment)

A full-stack task management app built for the Full Stack Developer coding
assessment. Front end in React (Vite), back end in Node.js/Express, database
in PostgreSQL. Includes a bonus currency conversion feature that integrates a
public third-party API (Step 3 of the assessment).

## Features

- List, add, edit, and delete tasks
- Mark a task as completed
- Task priority (Low / Medium / High) with color-coded badges
- Optional due date, with an "overdue" highlight for active tasks past due
- Filter tasks by All / Active / Completed
- Search tasks by title or description
- Bulk "clear completed" action
- Dark mode toggle (persisted to `localStorage`)
- Fully responsive layout (mobile/tablet/desktop)
- Currency converter using the [Frankfurter](https://www.frankfurter.dev/) API
  (free, no API key required)

## Tech Stack

- **Front end:** React 19, Vite
- **Back end:** Node.js, Express
- **Database:** PostgreSQL
- **Third-party API:** Frankfurter currency exchange API

## Project Structure

```
qt-fsd-task-manager/
├── backend/          # Express REST API
│   ├── src/
│   │   ├── db/pool.js
│   │   ├── routes/tasks.js
│   │   ├── routes/currency.js
│   │   └── server.js
│   ├── schema.sql
│   └── .env.example
├── frontend/          # React (Vite) app
│   └── src/
│       ├── components/
│       ├── api.js
│       └── App.jsx
├── STEP1_VIDEO_SCRIPT.md
├── STEP4_ANSWERS.md
└── README.md
```

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

See [backend/schema.sql](backend/schema.sql).

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a connection string to a hosted instance)

### 1. Database

Create a database and run the schema:

```bash
createdb task_manager
psql -d task_manager -f backend/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit DATABASE_URL / PORT if needed
npm run dev             # starts on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173, proxies /api to :5000
```

Open http://localhost:5173 in your browser.

## REST API

| Method | Endpoint              | Description        |
|--------|------------------------|---------------------|
| GET    | `/api/tasks`            | List all tasks      |
| POST   | `/api/tasks`             | Create a task (`{ title, description?, priority?, due_date? }`) |
| PUT    | `/api/tasks/:id`         | Update a task (`{ title?, description?, completed?, priority?, due_date? }`) |
| DELETE | `/api/tasks/:id`         | Delete a task        |
| GET    | `/api/currency/convert?from=USD&to=EUR&amount=100` | Convert currency (Step 3 integration) |

## Step 3: API Integration

- **API used:** [ExchangeRate-API (open.er-api.com)](https://www.exchangerate-api.com/docs/free)
  — free, no API key required, covers 160+ currencies including PKR, INR,
  BDT, NPR, AED, and SAR. (The JD's suggested `exchangerate.host` now
  requires a paid key as of this writing; an earlier version of this app
  used Frankfurter, but Frankfurter only publishes ECB rates for ~30
  currencies and does not include PKR, so it was swapped for this API.)
- **Implementation:** [backend/src/routes/currency.js](backend/src/routes/currency.js)
  proxies a request to `open.er-api.com/v6/latest/:from` and returns a
  simplified `{ from, to, rate, amount, converted, date }` payload. The
  front-end [CurrencyConverter](frontend/src/components/CurrencyConverter.jsx)
  component lets a user pick two currencies and an amount and calls this
  endpoint.
- **Commit:** see the git history for the commit(s) touching
  `backend/src/routes/currency.js` and `frontend/src/components/CurrencyConverter.jsx`.

## Submission Checklist

- [ ] GitHub Repository Link: _add after pushing to GitHub_
- [ ] Live Demo URL: _add if deployed_
- [x] Setup Instructions: see above
- [x] Database Schema: see above / [backend/schema.sql](backend/schema.sql)
- [x] Step 1 video script draft: [STEP1_VIDEO_SCRIPT.md](STEP1_VIDEO_SCRIPT.md)
- [x] Step 4 answers: [STEP4_ANSWERS.md](STEP4_ANSWERS.md)

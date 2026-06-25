# Project-Ready Express API (Week 6, Page 2)

**Copyright (c) 2026 Dr Shuo Ding `<shuoding@outlook.com>`.**
Licensed under the **GNU Affero General Public License v3.0 or later
(AGPL-3.0-or-later)**. Any copy, modification, or distribution must retain this
copyright notice and remain under the AGPL. See the [LICENSE](./LICENSE) file.

> **Disclaimer.** Teaching software, provided "as is" without warranty of any
> kind. It is intended for local classroom learning. The in-memory data is
> fictitious and resets every time the server restarts. The demo API key is for
> teaching only — never use it in a real system. The author accepts no
> liability for any use of this software.

---

This teaching demo shows how an Express API can be organised beyond a single
`index.js` file into clear, testable layers.

## What it demonstrates

- Route modules (`routes/`)
- Controllers (`controllers/`)
- Services with business rules (`services/`)
- Repositories for data access (`repositories/`)
- Request validation with **Zod** (`schemas/`, `middleware/validate.js`)
- Central error handling (`middleware/errorHandler.js`)
- Authentication middleware (`middleware/authRequired.js`)
- Pagination, filtering and sorting
- Consistent JSON responses (`utils.js`)

## Requirements

- **Node.js 24 LTS or newer** and **npm**.

## Run on Ubuntu

The helper script checks Node, copies `.env.example` to `.env` on first run,
installs packages and starts the server:

```bash
cd project_ready_express_api
chmod +x run_ubuntu.sh
./run_ubuntu.sh
```

Or by hand:

```bash
cd project_ready_express_api
cp .env.example .env
npm install
npm run dev
```

The server starts on port **4000**. Check it is healthy:

```text
http://localhost:4000/api/health
```

Press **Ctrl + C** to stop the server.

## Endpoints

| Method & path             | Auth required | Purpose                                   |
| ------------------------- | ------------- | ----------------------------------------- |
| `GET /api/health`         | no            | Service health check.                     |
| `GET /api/projects`       | no            | List projects (supports query options).   |
| `GET /api/projects/:id`   | no            | Get one project by id.                    |
| `POST /api/projects`      | yes           | Create a project.                         |
| `PATCH /api/projects/:id` | yes           | Update fields of a project.               |
| `DELETE /api/projects/:id`| yes           | Delete a project.                         |

### Query options for `GET /api/projects`

`status`, `category`, `search`, `sortBy`, `order` (`asc`/`desc`), `page`,
`limit` (max 50). Example:

```text
http://localhost:4000/api/projects?status=on_track&sortBy=progress&order=desc&page=1&limit=5
```

### Protected write routes

Write routes require this header (the value comes from `.env`):

```text
x-api-key: week6-demo-key
```

Example create with curl:

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -H "x-api-key: week6-demo-key" \
  -d '{"name":"New Project","owner":"Sam","status":"planning","category":"frontend","priority":"low","progress":10}'
```

### Allowed field values

- `status`: `planning`, `on_track`, `at_risk`, `complete`
- `category`: `frontend`, `database`, `authentication`, `devops`
- `priority`: `low`, `medium`, `high`
- `progress`: integer `0`–`100` (a project at `100` must have status `complete`)

## Response shape

Success responses use `{ "ok": true, "data": ... }` and list responses add a
`meta` object with `page`, `limit`, `total` and `totalPages`. Errors use
`{ "ok": false, "error": { "message": ... } }`, with a `details` array for
validation failures.

## Configuration (`.env`)

```text
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
DEMO_API_KEY=week6-demo-key
```

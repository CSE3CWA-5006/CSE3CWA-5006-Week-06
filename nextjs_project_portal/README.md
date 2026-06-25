# Next.js Project Portal (Week 6, Page 3)

**Copyright (c) 2026 Dr Shuo Ding `<shuoding@outlook.com>`.**
Licensed under the **GNU Affero General Public License v3.0 or later
(AGPL-3.0-or-later)**. Any copy, modification, or distribution must retain this
copyright notice and remain under the AGPL. See the [LICENSE](./LICENSE) file.

> **Disclaimer.** Teaching software, provided "as is" without warranty of any
> kind. It stores data in a local JSON file so the full-stack flow is easy to
> inspect; this is suitable for local learning only. A production project should
> use a real database. The author accepts no liability for any use of this
> software.

---

This teaching project closes the React and Node.js section of the subject. It
shows how Next.js organises a React application into one full-stack project.

## What it demonstrates

- `app/page.jsx` renders the main page as a **Server Component**.
- `components/ProjectForm.jsx` is a **Client Component** (interactive form state).
- `app/actions.js` contains a **Server Action** for form submission.
- `app/api/projects/route.js` exposes a JSON **Route Handler** (GET and POST).
- `lib/projects.js` reads and writes local JSON data for classroom practice.
- `app/loading.jsx` and `app/error.jsx` show route-level loading and error UI.

## Requirements

- **Node.js 20 LTS or newer** and **npm**.

## Run on Ubuntu

The helper script checks Node, installs packages and starts the dev server:

```bash
cd nextjs_project_portal
chmod +x run_ubuntu.sh
./run_ubuntu.sh
```

Or by hand:

```bash
cd nextjs_project_portal
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Press **Ctrl + C** to stop the server. For a production build, use
`npm run build` then `npm run start`.

## Testing the API route

With the server running, in another terminal:

```bash
# list projects
curl http://localhost:3000/api/projects

# create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"title":"Accessibility review","owner":"Mina","status":"planned","priority":"high"}'
```

### Allowed field values

- `status`: `planned`, `in_progress`, `complete`
- `priority`: `low`, `medium`, `high`
- `title`: at least 3 characters; `owner`: at least 2 characters.

## Project structure

```
nextjs_project_portal/
├── next.config.mjs            Pins the Turbopack workspace root to this folder
├── package.json
├── app/
│   ├── layout.jsx             Root layout and metadata
│   ├── page.jsx               Server Component home page
│   ├── actions.js             "use server" Server Action
│   ├── loading.jsx            Route loading UI
│   ├── error.jsx              Route error UI
│   ├── styles.css
│   └── api/projects/route.js  GET + POST Route Handler
├── components/
│   ├── ProjectCard.jsx        Server-rendered card
│   └── ProjectForm.jsx        "use client" interactive form
├── lib/projects.js            Read/write + validation over the JSON file
└── data/projects.json         Local data store (classroom only)
```

## Important teaching note

This demo stores data in a local JSON file so the full-stack flow is easy to
inspect. That is suitable for local learning. A production project should use a
real database such as PostgreSQL, MongoDB, or another managed data service.

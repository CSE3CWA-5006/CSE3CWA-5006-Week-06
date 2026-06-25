# CSE3CWA / CSE5006 — Week 6: Modern React, Express APIs and Next.js

**Copyright (c) 2026 Dr Shuo Ding `<shuoding@outlook.com>`.**
Licensed under the **GNU Affero General Public License v3.0 or later
(AGPL-3.0-or-later)**. Any copy, modification, or distribution must retain this
copyright notice and remain under the AGPL. See the [LICENSE](./LICENSE) file.

> **Disclaimer.** All code here is teaching material for the Cloud-Based Web
> Application subject, provided "as is" and without warranty of any kind. The
> sample data is fictitious and the demo credentials are for classroom use only.
> The projects are configured for local learning and must not be deployed
> publicly as-is. The author accepts no liability for any use of this software.

---

This repository contains the three teaching projects for Week 6, one per page of
the reading material. Together they trace one idea — *turning working code into a
clear, project-ready structure* — across the front end, the API layer, and a
full-stack framework.

| Page | Project folder              | Stack                         | Runs on                  |
| ---- | --------------------------- | ----------------------------- | ------------------------ |
| 1    | `modern_react_dashboard/`   | React + Vite                  | `http://localhost:5173`  |
| 2    | `project_ready_express_api/`| Node.js + Express + Zod       | `http://localhost:4000`  |
| 3    | `nextjs_project_portal/`    | Next.js (App Router)          | `http://localhost:3000`  |

Each project is self-contained, has its own `LICENSE`, `README.md` and
`run_ubuntu.sh`, and can be run on its own.

## Requirements

- **Node.js** (24 LTS recommended; the Next.js project needs 20 LTS or newer)
  and **npm**.
- A modern browser.

## Quick start

Each project follows the same pattern. For example, the React dashboard:

```bash
cd modern_react_dashboard
chmod +x run_ubuntu.sh
./run_ubuntu.sh
```

See each project's own `README.md` for full details, endpoints and structure:

- [`modern_react_dashboard/README.md`](./modern_react_dashboard/README.md)
- [`project_ready_express_api/README.md`](./project_ready_express_api/README.md)
- [`nextjs_project_portal/README.md`](./nextjs_project_portal/README.md)

## A note on data values

Pages 1 and 2 use the same project names (Campus Check-In, Library Booking, and
so on) so the front end and the API tell a consistent story. The Express API
uses machine-friendly enum values (`on_track`, `at_risk`) while the React
dashboard shows human-friendly labels (`On track`, `At risk`); this difference
is intentional and is explained in the reading pages.

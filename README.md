# Folio — Advanced Full-Stack Project Portal

A compact personal project-management application built with Next.js, PostgreSQL, server actions, route handlers, validation, services and repositories.

## Product experience

- Narrow, focused workspace with a refined desktop layout.
- Search, status and category filters live in the left navigation.
- Status uses one shared taxonomy everywhere: Planning, On track, At risk, Complete.
- Category uses one shared taxonomy everywhere: Frontend, Database, Authentication, DevOps, Full stack, Analytics.
- Top summary cards count the same four project statuses shown in the filters.
- Project cards are compact and open the shared project editor when clicked.
- Create and Edit use the same modal form and field set.
- PostgreSQL stores projects with a real relational data model; the task relationship is retained in the backend for future expansion.

## Full-stack architecture

```text
Browser
  |
  |-- Client Components
  |-- Server Actions
  |-- REST /api Route Handlers
  v
Services (business rules)
  v
Repositories (parameterised SQL)
  v
PostgreSQL
```

## Quick start on Ubuntu with PostgreSQL

Make sure PostgreSQL is installed and running, then:

```bash
./run_ubuntu.sh
```

The script installs Node.js dependencies, prepares a local database when the PostgreSQL service account is accessible, creates `.env.local`, loads the schema, and loads the current teaching seed once. Later `npm run db:setup` runs preserve your project changes until the seed version changes. Use `npm run db:reset` when you intentionally want to restore the current clean teaching dataset.

Open:

```text
http://localhost:3000
```

## Database commands

```bash
npm run db:setup
npm run db:reset
npm run db:verify
```

## REST API examples

List projects:

```bash
curl "http://localhost:3000/api/projects?status=on_track"
```

Create a project:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Accessibility Analytics",
    "owner": "Jordan",
    "status": "planning",
    "category": "analytics",
    "priority": "medium",
    "progress": 10,
    "summary": "Track accessibility findings across student projects."
  }'
```

List tasks for project 1:

```bash
curl http://localhost:3000/api/projects/1/tasks
```

## Teaching sequence

1. Requirements and domain model.
2. PostgreSQL schema and relationships.
3. Server-side repositories/services and API testing.
4. React interface connected to real server data.
5. Full-stack integration.
6. Next.js Server Components, Client Components, Server Actions and Route Handlers as one unified architecture.

### About npm warnings

On newer npm versions you may see an `npm warn allow-scripts` message for `sharp`. This is a dependency-install permission warning, not an application error.


Current seed version: `2026-08-12-final`. The first `npm run db:setup` after this version change restores the clean teaching dataset; later setup runs preserve existing project changes.

The current teaching dataset contains eight realistic projects distributed across the shared status, category and priority taxonomies. The seed version is tracked so setup does not overwrite student-created projects on every run.

## Copyright, licence and disclaimer

Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.

This project is licensed under the **GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**. You may copy, use, modify and redistribute the project only in accordance with that licence. Please preserve the copyright and licence notices in redistributed or modified versions. Modified versions must also satisfy the AGPL requirements, including the applicable source-availability requirements for network-interactive software.

Redistribution or modification does not grant permission to remove or replace the original copyright notice. If you publish a modified version, keep the original attribution and clearly identify your changes.

**Disclaimer:** This software is provided **without warranty**. Use it at your own risk. The author is not responsible for loss, damage, security incidents or other consequences arising from use, modification or redistribution of the software.

For licensing or attribution questions: **shuoding@outlook.com**. A copy of the full AGPL licence is included in `LICENSE` and is also available from the application's **License & copyright notice** link.

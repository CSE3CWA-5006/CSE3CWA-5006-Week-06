# Modern React Dashboard (Week 6, Page 1)

**Copyright (c) 2026 Dr Shuo Ding `<shuoding@outlook.com>`.**
Licensed under the **GNU Affero General Public License v3.0 or later
(AGPL-3.0-or-later)**. Any copy, modification, or distribution must retain this
copyright notice and remain under the AGPL. See the [LICENSE](./LICENSE) file
for the full terms.

> **Disclaimer.** This software is teaching material, provided "as is" and
> without warranty of any kind, express or implied. It is intended for local
> classroom learning only. The sample project data is fictitious. The author
> accepts no liability for any use of this software.

---

This teaching demo shows how a React interface can grow beyond a simple form and
table into a clear, responsive, product-style dashboard.

## What it demonstrates

- Layout components (`AppShell`)
- Reusable UI components (`MetricCard`, `ProjectCard`)
- Feature components (`FilterBar`, `ProjectDetail`)
- Controlled search and filter state
- Selected-item state (the detail panel)
- Loading, error, empty and success states (`StateMessage`)
- A custom hook for data loading (`useProjects`)
- Responsive layout for desktop, tablet and mobile

## Requirements

- **Node.js 24 LTS or newer** and **npm** (check with `node --version`).

## Run on Ubuntu

The simplest way is the helper script, which checks Node, installs packages and
starts the Vite dev server:

```bash
cd modern_react_dashboard
chmod +x run_ubuntu.sh
./run_ubuntu.sh
```

Or run the same steps by hand:

```bash
cd modern_react_dashboard
npm install
npm run dev
```

Then open the dashboard in your browser:

```text
http://localhost:5173
```

Press **Ctrl + C** in the terminal to stop the dev server.

## Project structure

```
modern_react_dashboard/
├── index.html                 Vite entry HTML
├── vite.config.js             Vite + React plugin configuration (port 5173)
├── package.json
└── src/
    ├── main.jsx               Mounts <App/> into #root
    ├── App.jsx                Composes the dashboard from components
    ├── styles.css             All dashboard styling
    ├── components/
    │   ├── AppShell.jsx       Sidebar + top bar layout shell
    │   ├── MetricCard.jsx     Single summary metric
    │   ├── FilterBar.jsx      Search box, status select, simulate-error button
    │   ├── ProjectCard.jsx    One project in the list
    │   ├── ProjectDetail.jsx  Detail panel for the selected project
    │   └── StateMessage.jsx   LoadingState, EmptyState, ErrorState
    ├── data/projects.js        Sample project data
    └── hooks/useProjects.js    Data loading, search, filter and selection state
```

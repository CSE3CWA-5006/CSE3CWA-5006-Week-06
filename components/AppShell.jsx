/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import FilterSidebar from "./FilterSidebar.jsx";
import { ProjectCreateButton } from "./ProjectFormModal.jsx";

export default function AppShell({ children, filterSummary }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Folio home">
          <span className="brand-mark">✦</span>
          <span className="brand-copy">
            <strong>Folio</strong>
            <span>Personal work</span>
          </span>
        </a>
        <FilterSidebar filterSummary={filterSummary} />
      </aside>

      <div className="main-column">
        <header className="topbar">
          <span className="topbar-spacer" aria-hidden="true" />
          <ProjectCreateButton />
        </header>
        {children}
        <footer className="app-footer">
          Copyright © 2026 Dr Shuo Ding
        </footer>
      </div>
    </div>
  );
}

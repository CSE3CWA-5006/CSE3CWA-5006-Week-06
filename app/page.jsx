/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import AppShell from "../components/AppShell.jsx";
import MetricCard from "../components/MetricCard.jsx";
import ProjectGrid from "../components/ProjectGrid.jsx";
import { PROJECT_STATUSES } from "../lib/project-options.js";
import { getDashboardData } from "../lib/services/projects.service.js";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    search: params?.search?.toString() ?? "",
    status: params?.status?.toString() ?? "",
    category: params?.category?.toString() ?? "",
    priority: params?.priority?.toString() ?? ""
  };

  const dashboard = await getDashboardData(filters);

  const summary = dashboard.summary;
  const projectResult = dashboard.projectResult;
  const snapshot = dashboard.filterSummary;

  const activeFilter = Boolean(filters.search || filters.status || filters.category || filters.priority);

  return (
    <AppShell filterSummary={snapshot}>
      <main id="projects" className="dashboard">
        <section className="metrics-grid" aria-label="Project status summary">
          <MetricCard
            label="All projects"
            value={summary.totalProjects}
            names={summary.allNames}
            tone="all"
          />
          {PROJECT_STATUSES.map(([value, label]) => (
            <MetricCard
              key={value}
              label={label}
              value={summary.byStatus[value]?.length ?? 0}
              names={summary.byStatus[value] ?? []}
            />
          ))}
        </section>

        <section className="project-section" aria-label="Project list">
          <div className="result-meta">
            <span>{projectResult.total} projects</span>
            {activeFilter ? <span className="result-filtered">Filtered view</span> : null}
          </div>

          <section className="project-grid" aria-label="Projects">
            {projectResult.items.length ? (
              <ProjectGrid projects={projectResult.items} />
            ) : (
              <div className="state-box">
                <div className="empty-icon">—</div>
                <h3>No matching projects</h3>
                <p>Try another search or filter.</p>
              </div>
            )}
          </section>
        </section>
      </main>
    </AppShell>
  );
}

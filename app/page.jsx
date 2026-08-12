/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import AppShell from "../components/AppShell.jsx";
import DashboardMetrics from "../components/DashboardMetrics.jsx";
import ProjectGrid from "../components/ProjectGrid.jsx";
import { DashboardProvider } from "../components/DashboardProvider.jsx";
import { getDashboardSnapshot } from "../lib/services/projects.service.js";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const initialFilters = {
    search: params?.search?.toString() ?? "",
    tags: params?.tags?.toString().split(",").filter(Boolean) ?? []
  };

  // One unfiltered query, fetched once when the page is first opened. Every
  // tag click, search keystroke, and every create/update/delete, is applied
  // to this same in-memory dataset on the client afterwards, so interactions
  // are instant and never show a stale or empty result.
  const { rows } = await getDashboardSnapshot();

  return (
    <DashboardProvider initialProjects={rows} initialFilters={initialFilters}>
      <AppShell>
        <main id="projects" className="dashboard">
          <DashboardMetrics />
          <ProjectGrid />
        </main>
      </AppShell>
    </DashboardProvider>
  );
}

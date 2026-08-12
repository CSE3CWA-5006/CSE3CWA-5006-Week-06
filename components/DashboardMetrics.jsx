/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

import MetricCard from "./MetricCard.jsx";
import { PROJECT_STATUSES } from "../lib/project-options.js";
import { useDashboard } from "./DashboardProvider.jsx";

export default function DashboardMetrics() {
  const { filterSummary } = useDashboard();

  return (
    <section className="metrics-grid" aria-label="Project status summary">
      <MetricCard
        label="All projects"
        value={filterSummary.total}
        names={filterSummary.allNames}
        tone="all"
      />
      {PROJECT_STATUSES.map(([value, label]) => (
        <MetricCard
          key={value}
          label={label}
          value={filterSummary.byStatus[value]?.length ?? 0}
          names={filterSummary.byStatus[value] ?? []}
        />
      ))}
    </section>
  );
}

/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

export default function MetricCard({ label, value, tone, names = [] }) {
  const tooltip = names.length ? names.join("\n") : "No projects";

  return (
    <article
      className={`metric-card metric-summary-tooltip${tone ? ` metric-${tone}` : ""}`}
      data-tooltip={tooltip}
      tabIndex={0}
      aria-label={`${label}: ${value} project${value === 1 ? "" : "s"}`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

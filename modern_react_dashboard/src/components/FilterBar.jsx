/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

const statuses = ["All", "On track", "At risk", "Planning", "Complete"];

export default function FilterBar({ query, statusFilter, onQueryChange, onStatusChange, onSimulateError }) {
  return (
    <section className="filter-bar" aria-label="Project filters">
      <label>
        <span>Search projects</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name, owner or category"
        />
      </label>
      <label>
        <span>Status</span>
        <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <button className="secondary-button" type="button" onClick={onSimulateError}>
        Simulate error
      </button>
    </section>
  );
}

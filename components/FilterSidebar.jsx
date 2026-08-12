/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

import { useSearchParams } from "next/navigation";
import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "../lib/project-options.js";

function buildHref(current, changes = {}) {
  const params = new URLSearchParams();
  const search = changes.search ?? current.search;
  const status = changes.status ?? current.status;
  const category = changes.category ?? current.category;
  const priority = changes.priority ?? current.priority;

  if (search) params.set("search", search);
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  if (priority) params.set("priority", priority);

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function FilterGroup({ title, type, options, current, search, category, status, priority, counts }) {
  return (
    <section className="sidebar-filter-group" aria-labelledby={`${type}-filter-title`}>
      <div className="sidebar-filter-heading" id={`${type}-filter-title`}>{title}</div>
      <nav className="sidebar-filter-list" aria-label={`${title} filters`}>
        {options.map(([value, label]) => {
          const count = counts?.[value] ?? 0;
          return (
            <a
              key={value}
              className={current === value ? "sidebar-filter active" : "sidebar-filter"}
              href={buildHref(
                { search, status, category, priority },
                type === "status" ? { status: value } : type === "category" ? { category: value } : { priority: value }
              )}
              aria-label={`${label}, ${count} project${count === 1 ? "" : "s"}`}
            >
              <span className={`filter-dot filter-dot-${value}`} aria-hidden="true" />
              <span className="sidebar-filter-label">{label}</span>
              <span className="sidebar-filter-count">{count}</span>
            </a>
          );
        })}
      </nav>
    </section>
  );
}

export default function FilterSidebar({ filterSummary }) {
  const searchParams = useSearchParams();
  const filters = {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    category: searchParams.get("category") ?? "",
    priority: searchParams.get("priority") ?? ""
  };

  const clearSearchHref = buildHref(filters, { search: "" });

  return (
    <div className="sidebar-content">
      <form className="sidebar-search" action="/" method="get" role="search">
        <label htmlFor="workspace-search">Search</label>
        <div className="search-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            id="workspace-search"
            name="search"
            type="search"
            placeholder="Search projects…"
            defaultValue={filters.search}
            autoComplete="off"
          />
          {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
          {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
          {filters.priority ? <input type="hidden" name="priority" value={filters.priority} /> : null}
          {filters.search ? (
            <a className="search-clear" href={clearSearchHref} aria-label="Clear search" title="Clear search">×</a>
          ) : null}
          <button type="submit" className="search-submit" aria-label="Submit search">↵</button>
        </div>
      </form>

      <a
        className={`all-projects-link ${!filters.status && !filters.category && !filters.priority ? "active" : ""}`}
        href={buildHref(filters, { status: "", category: "", priority: "" })}
        aria-label={`All projects, ${filterSummary.total} project${filterSummary.total === 1 ? "" : "s"}`}
      >
        <span className="all-projects-dot" aria-hidden="true" />
        <span className="sidebar-filter-label">All projects</span>
        <span className="sidebar-filter-count">{filterSummary.total}</span>
      </a>

      <FilterGroup
        title="Status"
        type="status"
        options={PROJECT_STATUSES}
        current={filters.status}
        search={filters.search}
        category={filters.category}
        status={filters.status}
        priority={filters.priority}
        counts={Object.fromEntries(Object.entries(filterSummary.byStatus ?? {}).map(([key, value]) => [key, value.length]))}
      />

      <FilterGroup
        title="Category"
        type="category"
        options={PROJECT_CATEGORIES}
        current={filters.category}
        search={filters.search}
        category={filters.category}
        status={filters.status}
        priority={filters.priority}
        counts={Object.fromEntries(Object.entries(filterSummary.byCategory ?? {}).map(([key, value]) => [key, value.length]))}
      />

      <FilterGroup
        title="Priority"
        type="priority"
        options={PROJECT_PRIORITIES}
        current={filters.priority}
        search={filters.search}
        category={filters.category}
        status={filters.status}
        priority={filters.priority}
        counts={Object.fromEntries(Object.entries(filterSummary.byPriority ?? {}).map(([key, value]) => [key, value.length]))}
      />
    </div>
  );
}

/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "../lib/project-options.js";
import { tagId } from "../lib/dashboard-filter.js";
import { useDashboard } from "./DashboardProvider.jsx";

// Status/category/priority grouped under headings, rendered as wrapping
// blog-style tag pills. Within a group, picking several tags is OR; across
// groups it's AND. A group nobody has touched yet shows every reachable tag
// as "linked" (a lighter, distinct active state) instead of plain default —
// that's the cross-group linkage: picking a tag in one group visibly lights
// up the compatible tags in the other two, without you having to click them
// yourself. Clicking a linked tag narrows that group explicitly.
function TagGroup({ title, dimension, options, groups, isTagActive, toggleTag, tagCounts }) {
  const hasExplicitSelection = groups[dimension].length > 0;

  return (
    <section className="sidebar-filter-group" aria-labelledby={`${dimension}-filter-title`}>
      <div className="sidebar-filter-heading" id={`${dimension}-filter-title`}>{title}</div>
      <div className="tag-pill-group" role="group" aria-label={`${title} tags`}>
        {options.map(([value, label]) => {
          const active = isTagActive(dimension, value);
          const linked = active && !hasExplicitSelection;
          const count = tagCounts[value] ?? 0;
          const className = ["tag-pill", active ? "active" : "", linked ? "linked" : ""].filter(Boolean).join(" ");
          return (
            <button
              key={value}
              type="button"
              className={className}
              onClick={() => toggleTag(dimension, value)}
              aria-pressed={active}
              aria-label={`${label}, ${count} project${count === 1 ? "" : "s"}${linked ? " (linked)" : ""}`}
              disabled={count === 0 && !active}
            >
              <span className={`filter-dot filter-dot-${value}`} aria-hidden="true" />
              {label}
              <span className="tag-pill-count">{count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function FilterSidebar() {
  const { search, setSearch, tags, groups, isTagActive, toggleTag, clearTags, tagCounts, filterSummary } = useDashboard();

  return (
    <div className="sidebar-content">
      <form
        className="sidebar-search"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="workspace-search">Search</label>
        <div className="search-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            id="workspace-search"
            name="search"
            type="search"
            placeholder="Search projects…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoComplete="off"
          />
          {search ? (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              title="Clear search"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          ) : null}
          <button type="submit" className="search-submit" aria-label="Submit search">↵</button>
        </div>
      </form>

      <button
        type="button"
        className={`all-projects-link ${tags.length === 0 ? "active" : ""}`}
        onClick={clearTags}
        aria-label={`All projects, ${filterSummary.total} project${filterSummary.total === 1 ? "" : "s"}`}
      >
        <span className="all-projects-dot" aria-hidden="true" />
        <span className="sidebar-filter-label">All projects</span>
        <span className="sidebar-filter-count">{filterSummary.total}</span>
      </button>

      <TagGroup title="Status" dimension="status" options={PROJECT_STATUSES} groups={groups} isTagActive={isTagActive} toggleTag={toggleTag} tagCounts={tagCounts} />
      <TagGroup title="Category" dimension="category" options={PROJECT_CATEGORIES} groups={groups} isTagActive={isTagActive} toggleTag={toggleTag} tagCounts={tagCounts} />
      <TagGroup title="Priority" dimension="priority" options={PROJECT_PRIORITIES} groups={groups} isTagActive={isTagActive} toggleTag={toggleTag} tagCounts={tagCounts} />
    </div>
  );
}

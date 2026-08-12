/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  buildFilterSummary,
  buildTagCounts,
  buildTaggedResult,
  groupTagsByDimension,
  tagId
} from "../lib/dashboard-filter.js";

const DIMENSIONS = ["status", "category", "priority"];

const DashboardContext = createContext(null);

function stateToSearch({ search, tags }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (tags.length) params.set("tags", tags.join(","));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function syncUrl(state) {
  if (typeof window === "undefined") return;
  const next = stateToSearch(state);
  const current = `${window.location.pathname}${window.location.search}`;
  if (next !== current) window.history.replaceState(window.history.state, "", next);
}

/**
 * Owns the single source of truth for the dashboard: the full project list,
 * the search text, and the selected tags (status/category/priority as one
 * blog-style tag cloud). See lib/dashboard-filter.js for the exact rules,
 * in short:
 *   - tags within one group (e.g. two Priority values) OR together;
 *   - groups AND together, but only a group with an explicit selection
 *     constrains anything;
 *   - a group with no explicit selection is shown "linked": every tag in
 *     it that's still reachable given the other groups' selection renders
 *     active, so picking a tag visibly lights up compatible tags in the
 *     other two groups, and clicking one of those narrows that group.
 * Every tag click, search keystroke, project creation, edit and delete
 * updates this state directly and synchronously, so counts, the grid and
 * the tag groups are always in lockstep.
 */
export function DashboardProvider({ initialProjects, initialFilters, children }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearchState] = useState(initialFilters?.search ?? "");
  const [tags, setTagsState] = useState(() => initialFilters?.tags ?? []);

  const setSearch = useCallback((value) => {
    setSearchState(value);
    syncUrl({ search: value, tags });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  const clearTags = useCallback(() => {
    setTagsState([]);
    syncUrl({ search, tags: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Postgres BIGSERIAL ids come back through `pg` as strings (to avoid
  // precision loss), but a freshly created project's id can arrive as a
  // plain number depending on the caller. Compare loosely everywhere ids
  // are matched so "3" and 3 are always treated as the same project.
  const sameId = (a, b) => String(a) === String(b);

  const addProject = useCallback((project) => {
    setProjects((current) => [project, ...current.filter((item) => !sameId(item.id, project.id))]);
  }, []);

  const replaceProject = useCallback((project) => {
    setProjects((current) => current.map((item) => (sameId(item.id, project.id) ? { ...item, ...project } : item)));
  }, []);

  const removeProjects = useCallback((ids) => {
    setProjects((current) => current.filter((item) => !ids.some((id) => sameId(item.id, id))));
  }, []);

  // Grand totals, unaffected by search/tags — what the top metric cards and
  // the sidebar's "All projects" total show.
  const filterSummary = useMemo(() => buildFilterSummary(projects), [projects]);
  const groups = useMemo(() => groupTagsByDimension(tags), [tags]);
  // Each tag's count ignores its OWN group's selection and applies only the
  // other two groups', so the number is always exactly what picking that
  // tag would include or keep — see lib/dashboard-filter.js.
  const tagCounts = useMemo(() => buildTagCounts(projects, { search, tags }), [projects, search, tags]);
  const projectResult = useMemo(() => buildTaggedResult(projects, { search, tags }), [projects, search, tags]);
  const activeFilter = Boolean(search || tags.length);

  // A group with no explicit selection of its own is "linked" — but only
  // once at least one OTHER group has an explicit pick. With nothing
  // selected anywhere, every tag simply starts neutral (no pre-lit tags on
  // first load). The moment you pick a tag in one group, the still-untouched
  // groups start showing which of their own tags remain reachable given
  // that pick, lit up as "active" — that's the cross-group linkage.
  const isTagActive = useCallback((dimension, value) => {
    const explicit = groups[dimension];
    if (explicit.length > 0) return explicit.includes(value);
    const anyOtherGroupExplicit = DIMENSIONS.some((d) => d !== dimension && groups[d].length > 0);
    if (!anyOtherGroupExplicit) return false;
    return (tagCounts[value] ?? 0) > 0;
  }, [groups, tagCounts]);

  const toggleTag = useCallback((dimension, value) => {
    setTagsState((current) => {
      const currentGroups = groupTagsByDimension(current);
      const groupValues = currentGroups[dimension];
      const otherTags = current.filter((id) => id.split(":")[0] !== dimension);

      // Whether this group was showing plain-neutral or cross-linked, this
      // is the first explicit interaction with THIS group either way — "I
      // want exactly this one" is the obvious, unambiguous meaning of a
      // first click. A second click on a different tag in the same group
      // (now that it has an explicit selection) OR's it in below.
      const nextGroupValues = groupValues.length === 0
        ? [value]
        : groupValues.includes(value)
          ? groupValues.filter((v) => v !== value)
          : [...groupValues, value];

      const next = [...otherTags, ...nextGroupValues.map((v) => tagId(dimension, v))];
      syncUrl({ search, tags: next });
      return next;
    });
  }, [search]);

  const value = useMemo(() => ({
    projects,
    search,
    tags,
    groups,
    setSearch,
    toggleTag,
    clearTags,
    isTagActive,
    addProject,
    replaceProject,
    removeProjects,
    filterSummary,
    tagCounts,
    projectResult,
    activeFilter
  }), [projects, search, tags, groups, setSearch, toggleTag, clearTags, isTagActive, addProject, replaceProject, removeProjects, filterSummary, tagCounts, projectResult, activeFilter]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
}

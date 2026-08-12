/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

// Isomorphic (server + client) helpers for turning a raw project row set into
// filter counts and a filtered/paginated result. Used by the repository for
// the initial server-rendered snapshot AND by the client dashboard so that
// every later interaction (status/category/priority/search click, create,
// update, delete) is computed instantly in memory instead of round-tripping
// to the server and re-querying PostgreSQL.

import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "./project-options.js";

export function emptyBuckets(options) {
  return Object.fromEntries(options.map(([value]) => [value, []]));
}

export function addToBucketMap(target, key, name) {
  const normalised = String(key ?? "").trim().toLowerCase();
  if (target[normalised]) target[normalised].push(name);
}

export function buildFilterSummary(rows) {
  const byStatus = emptyBuckets(PROJECT_STATUSES);
  const byCategory = emptyBuckets(PROJECT_CATEGORIES);
  const byPriority = emptyBuckets(PROJECT_PRIORITIES);

  for (const row of rows) {
    addToBucketMap(byStatus, row.status, row.name);
    addToBucketMap(byCategory, row.category, row.name);
    addToBucketMap(byPriority, row.priority, row.name);
  }

  return {
    total: rows.length,
    allNames: rows.map((row) => row.name),
    byStatus,
    byCategory,
    byPriority
  };
}

function normalisedFilters(filters = {}) {
  return {
    search: String(filters.search ?? "").trim().toLowerCase(),
    status: String(filters.status ?? "").trim().toLowerCase(),
    category: String(filters.category ?? "").trim().toLowerCase(),
    priority: String(filters.priority ?? "").trim().toLowerCase()
  };
}

function rowMatches(row, { search, status, category, priority }, ignoreDimension) {
  const matchesSearch = !search ||
    String(row.name).toLowerCase().includes(search) ||
    String(row.owner).toLowerCase().includes(search);
  const matchesStatus = ignoreDimension === "status" || !status || String(row.status).toLowerCase() === status;
  const matchesCategory = ignoreDimension === "category" || !category || String(row.category).toLowerCase() === category;
  const matchesPriority = ignoreDimension === "priority" || !priority || String(row.priority).toLowerCase() === priority;
  return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
}

export function buildProjectResult(rows, filters = {}) {
  const parsed = normalisedFilters(filters);
  const filtered = rows.filter((row) => rowMatches(row, parsed, null));

  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total: filtered.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(filtered.length / limit))
  };
}

// Sidebar "facet" counts: how many projects each Status/Category/Priority
// option would match if it were clicked *right now*, given whichever other
// filters (search + the other two dimensions) are already active. Each
// dimension's own current value is deliberately ignored while computing its
// own counts, otherwise selecting a value collapses its own bucket to just
// itself. Without this, a count badge can show e.g. "High: 1" while a
// different, already-active filter (say Status) excludes that one project —
// clicking would then AND the two filters together and land on zero
// results even though the sidebar just told you there was one.
export function buildFacetCounts(rows, filters = {}) {
  const parsed = normalisedFilters(filters);

  const byStatus = emptyBuckets(PROJECT_STATUSES);
  const byCategory = emptyBuckets(PROJECT_CATEGORIES);
  const byPriority = emptyBuckets(PROJECT_PRIORITIES);

  for (const row of rows) {
    if (rowMatches(row, parsed, "status")) addToBucketMap(byStatus, row.status, row.name);
    if (rowMatches(row, parsed, "category")) addToBucketMap(byCategory, row.category, row.name);
    if (rowMatches(row, parsed, "priority")) addToBucketMap(byPriority, row.priority, row.name);
  }

  return { byStatus, byCategory, byPriority };
}

// --- Tag cloud filtering (status + category + priority as one set of
// clickable, blog-style tags, but cross-linked across the three groups) ---
//
// Every project has exactly one status, one category and one priority, so
// each is turned into a tag id of the form "<dimension>:<value>" — e.g.
// "status:on_track", "priority:high". Tag ids never collide across
// dimensions because the three value vocabularies don't overlap.
//
// Rules:
//  - Within one group (e.g. Priority), picking several tags is OR: a
//    project matches the group if it has ANY of the selected values.
//  - Across groups, it's AND: a project must satisfy every group that has
//    at least one explicit selection. A group with no explicit selection
//    imposes no constraint.
//  - Cross-group linkage: a group with NO explicit selection is displayed
//    as "linked" — every tag in it that is still reachable given the OTHER
//    groups' current selection renders active, so picking a tag visibly
//    lights up the compatible tags elsewhere. Clicking one of those
//    linked-but-unpicked tags narrows that group explicitly (removing just
//    that one value from "everything reachable").
//  - A tag's count is always computed ignoring its OWN group's selection
//    and applying only the OTHER groups' constraints, so the number next
//    to a tag is always exactly what selecting it would include — it can
//    never promise a result a click can't deliver, and deleting a project
//    can only ever zero out the tags that project actually had.

const DIMENSIONS = ["status", "category", "priority"];
const OPTIONS_BY_DIMENSION = {
  status: PROJECT_STATUSES.map(([value]) => value),
  category: PROJECT_CATEGORIES.map(([value]) => value),
  priority: PROJECT_PRIORITIES.map(([value]) => value)
};

export function tagId(dimension, value) {
  return `${dimension}:${value}`;
}

export function tagDimension(id) {
  return id.split(":")[0];
}

export function tagValue(id) {
  return id.slice(id.indexOf(":") + 1);
}

export function optionsForDimension(dimension) {
  return OPTIONS_BY_DIMENSION[dimension] ?? [];
}

// Splits a flat tag-id list into per-dimension value arrays, e.g.
// ["status:on_track", "priority:high"] -> { status: ["on_track"], category: [], priority: ["high"] }
export function groupTagsByDimension(tags = []) {
  const groups = { status: [], category: [], priority: [] };
  for (const id of tags) {
    const dim = tagDimension(id);
    if (groups[dim]) groups[dim].push(tagValue(id));
  }
  return groups;
}

function matchesSearchText(row, search) {
  const s = String(search ?? "").trim().toLowerCase();
  return !s || String(row.name).toLowerCase().includes(s) || String(row.owner).toLowerCase().includes(s);
}

function rowMatchesGroups(row, groups, ignoreDimension) {
  for (const dim of DIMENSIONS) {
    if (dim === ignoreDimension) continue;
    const selected = groups[dim];
    if (selected.length === 0) continue;
    const rowValue = String(row[dim] ?? "").trim().toLowerCase();
    if (!selected.includes(rowValue)) return false;
  }
  return true;
}

export function buildTaggedResult(rows, { search = "", tags = [] } = {}) {
  const groups = groupTagsByDimension(tags);
  const filtered = rows.filter((row) => matchesSearchText(row, search) && rowMatchesGroups(row, groups, null));
  return { items: filtered, total: filtered.length };
}

// Per-tag counts, each ignoring its own dimension's constraint (see rules
// above). One pass over the rows computes every tag's count at once.
export function buildTagCounts(rows, { search = "", tags = [] } = {}) {
  const groups = groupTagsByDimension(tags);
  const counts = {};
  for (const value of [...OPTIONS_BY_DIMENSION.status, ...OPTIONS_BY_DIMENSION.category, ...OPTIONS_BY_DIMENSION.priority]) {
    counts[value] = 0;
  }

  for (const row of rows) {
    if (!matchesSearchText(row, search)) continue;
    for (const dim of DIMENSIONS) {
      if (!rowMatchesGroups(row, groups, dim)) continue;
      const value = String(row[dim] ?? "").trim().toLowerCase();
      if (value in counts) counts[value] += 1;
    }
  }

  return counts;
}

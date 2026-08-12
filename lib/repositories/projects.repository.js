/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { query, pool } from "../db.js";
import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "../project-options.js";

const projectSelect = `
  SELECT
    p.id,
    p.name,
    p.owner,
    p.status,
    p.category,
    p.priority,
    p.progress,
    p.summary,
    p.due_date AS "dueDate",
    p.created_at AS "createdAt",
    p.updated_at AS "updatedAt",
    COUNT(t.id)::int AS "taskCount",
    COUNT(t.id) FILTER (WHERE t.status = 'done')::int AS "doneTaskCount"
  FROM projects p
  LEFT JOIN tasks t ON t.project_id = p.id
`;

export async function findProjects({ search = "", status = "", category = "", priority = "", page = 1, limit = 20 }) {
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(p.name ILIKE $${params.length} OR p.owner ILIKE $${params.length})`);
  }

  if (status) {
    params.push(status);
    conditions.push(`p.status = $${params.length}`);
  }

  if (category) {
    params.push(category);
    conditions.push(`p.category = $${params.length}`);
  }

  if (priority) {
    params.push(priority);
    conditions.push(`LOWER(p.priority) = LOWER($${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await query(`SELECT COUNT(*)::int AS total FROM projects p ${where}`, params);
  const total = countResult.rows[0].total;

  params.push(limit);
  const limitIndex = params.length;
  params.push((page - 1) * limit);
  const offsetIndex = params.length;

  const result = await query(
    `${projectSelect}
     ${where}
     GROUP BY p.id
     ORDER BY
       CASE p.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
       p.updated_at DESC
     LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    params
  );

  return {
    items: result.rows,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
}

export async function findProjectById(id) {
  const result = await query(
    `${projectSelect}
     WHERE p.id = $1
     GROUP BY p.id`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createProject(input) {
  const result = await query(
    `INSERT INTO projects
      (name, owner, status, category, priority, progress, summary, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING
       id, name, owner, status, category, priority, progress, summary,
       due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [
      input.name,
      input.owner,
      input.status,
      input.category,
      input.priority,
      input.progress,
      input.summary,
      input.dueDate
    ]
  );
  return result.rows[0];
}

export async function updateProject(id, input) {
  const fields = [];
  const params = [];
  const mapping = {
    name: "name",
    owner: "owner",
    status: "status",
    category: "category",
    priority: "priority",
    progress: "progress",
    summary: "summary",
    dueDate: "due_date"
  };

  for (const [key, column] of Object.entries(mapping)) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      params.push(input[key]);
      fields.push(`${column} = $${params.length}`);
    }
  }

  if (!fields.length) return findProjectById(id);

  params.push(id);
  const result = await query(
    `UPDATE projects
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${params.length}
     RETURNING
       id, name, owner, status, category, priority, progress, summary,
       due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,
    params
  );
  return result.rows[0] ?? null;
}

export async function deleteProjects(ids) {
  if (!ids.length) return [];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `DELETE FROM projects
       WHERE id = ANY($1::bigint[])
       RETURNING id, name`,
      [ids]
    );
    await client.query("COMMIT");
    return result.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteProject(id) {
  const deleted = await deleteProjects([id]);
  return deleted[0] ?? null;
}

function emptyBuckets(options) {
  return Object.fromEntries(options.map(([value]) => [value, []]));
}

function addToBucketMap(target, key, name) {
  const normalised = String(key ?? "").trim().toLowerCase();
  if (target[normalised]) target[normalised].push(name);
}

function buildFilterSummary(rows) {
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

function buildProjectResult(rows, filters) {
  const search = String(filters.search ?? "").trim().toLowerCase();
  const status = String(filters.status ?? "").trim().toLowerCase();
  const category = String(filters.category ?? "").trim().toLowerCase();
  const priority = String(filters.priority ?? "").trim().toLowerCase();

  const filtered = rows.filter((row) => {
    const matchesSearch = !search ||
      String(row.name).toLowerCase().includes(search) ||
      String(row.owner).toLowerCase().includes(search);
    const matchesStatus = !status || String(row.status).toLowerCase() === status;
    const matchesCategory = !category || String(row.category).toLowerCase() === category;
    const matchesPriority = !priority || String(row.priority).toLowerCase() === priority;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

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

export async function getDashboardData(filters = {}) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ");

    const result = await client.query(`
      SELECT
        p.id,
        p.name,
        p.owner,
        p.status,
        p.category,
        p.priority,
        p.progress,
        p.summary,
        p.due_date AS "dueDate",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        COUNT(t.id)::int AS "taskCount",
        COUNT(t.id) FILTER (WHERE t.status = 'done')::int AS "doneTaskCount"
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      GROUP BY p.id
      ORDER BY
        CASE p.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        p.updated_at DESC,
        p.id ASC
    `);

    const rows = result.rows;
    const filterSummary = buildFilterSummary(rows);
    const projectResult = buildProjectResult(rows, filters);

    await client.query("COMMIT");

    return {
      filterSummary,
      summary: {
        totalProjects: filterSummary.total,
        allNames: filterSummary.allNames,
        byStatus: filterSummary.byStatus
      },
      projectResult
    };
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
  }
}

export async function getDashboardSummary() {
  const result = await query(`SELECT name, status FROM projects ORDER BY name ASC`);
  const byStatus = emptyBuckets(PROJECT_STATUSES);
  for (const row of result.rows) addToBucketMap(byStatus, row.status, row.name);
  return {
    totalProjects: result.rows.length,
    allNames: result.rows.map((row) => row.name),
    byStatus
  };
}

export async function getFilterSummary() {
  const result = await query(`SELECT id, name, status, category, priority FROM projects ORDER BY name ASC`);
  return buildFilterSummary(result.rows);
}

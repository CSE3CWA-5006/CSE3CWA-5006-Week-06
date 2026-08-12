/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { query, pool } from "../db.js";
import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "../project-options.js";
import { addToBucketMap, buildFilterSummary, buildProjectResult, emptyBuckets } from "../dashboard-filter.js";

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
  if (!ids.length) return { deleted: [], allFound: true };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const foundResult = await client.query(
      `SELECT id, name
       FROM projects
       WHERE id = ANY($1::bigint[])
       FOR UPDATE`,
      [ids]
    );

    if (foundResult.rows.length !== ids.length) {
      await client.query("ROLLBACK");
      return {
        deleted: foundResult.rows,
        allFound: false
      };
    }

    const result = await client.query(
      `DELETE FROM projects
       WHERE id = ANY($1::bigint[])
       RETURNING id, name`,
      [ids]
    );
    await client.query("COMMIT");
    return { deleted: result.rows, allFound: true };
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteProject(id) {
  const result = await deleteProjects([id]);
  return result.allFound ? (result.deleted[0] ?? null) : null;
}

// The full, unfiltered project snapshot (one row per project, with task
// counts) plus the filter-bucket summary derived from it. This is the only
// query the dashboard needs: status/category/priority/search filtering is
// applied afterwards, in memory, both here (for the very first server
// render) and on the client (for every filter click, create, update and
// delete afterwards) so the UI never has to wait on a fresh round-trip to
// PostgreSQL just to change what is shown.
export async function getSnapshot() {
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

    await client.query("COMMIT");

    return { rows, filterSummary };
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
  }
}

export async function getDashboardData(filters = {}) {
  const { rows, filterSummary } = await getSnapshot();
  const projectResult = buildProjectResult(rows, filters);

  return {
    filterSummary,
    summary: {
      totalProjects: filterSummary.total,
      allNames: filterSummary.allNames,
      byStatus: filterSummary.byStatus
    },
    projectResult
  };
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

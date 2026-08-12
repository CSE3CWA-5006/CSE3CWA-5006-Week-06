/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { query } from "../db.js";

export async function findTasksByProject(projectId) {
  const result = await query(
    `SELECT
       id,
       project_id AS "projectId",
       title,
       assignee,
       status,
       priority,
       due_date AS "dueDate",
       created_at AS "createdAt",
       updated_at AS "updatedAt"
     FROM tasks
     WHERE project_id = $1
     ORDER BY
       CASE status WHEN 'blocked' THEN 1 WHEN 'in_progress' THEN 2 WHEN 'todo' THEN 3 ELSE 4 END,
       CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
       due_date NULLS LAST,
       id`,
    [projectId]
  );
  return result.rows;
}

export async function findTaskById(id) {
  const result = await query(
    `SELECT id, project_id AS "projectId", title, assignee, status, priority,
            due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"
     FROM tasks WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createTask(input) {
  const result = await query(
    `INSERT INTO tasks (project_id, title, assignee, status, priority, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, project_id AS "projectId", title, assignee, status, priority,
               due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,
    [input.projectId, input.title, input.assignee, input.status, input.priority, input.dueDate]
  );
  return result.rows[0];
}

export async function updateTask(id, input) {
  const fields = [];
  const params = [];
  const mapping = {
    title: "title",
    assignee: "assignee",
    status: "status",
    priority: "priority",
    dueDate: "due_date"
  };

  for (const [key, column] of Object.entries(mapping)) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      params.push(input[key]);
      fields.push(`${column} = $${params.length}`);
    }
  }

  if (!fields.length) return findTaskById(id);

  params.push(id);
  const result = await query(
    `UPDATE tasks
     SET ${fields.join(", ")}, updated_at = NOW()
     WHERE id = $${params.length}
     RETURNING id, project_id AS "projectId", title, assignee, status, priority,
               due_date AS "dueDate", created_at AS "createdAt", updated_at AS "updatedAt"`,
    params
  );
  return result.rows[0] ?? null;
}

export async function deleteTask(id) {
  const result = await query(`DELETE FROM tasks WHERE id = $1 RETURNING id, project_id AS "projectId", title`, [id]);
  return result.rows[0] ?? null;
}

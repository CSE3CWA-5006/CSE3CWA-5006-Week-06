/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import pg from "pg";

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000
});

const buckets = {
  status: ["planning", "on_track", "at_risk", "complete"],
  category: ["frontend", "database", "authentication", "devops", "full_stack", "analytics"],
  priority: ["low", "medium", "high"]
};

await client.connect();
try {
  const projectResult = await client.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'planning')::int AS planning,
      COUNT(*) FILTER (WHERE status = 'on_track')::int AS on_track,
      COUNT(*) FILTER (WHERE status = 'at_risk')::int AS at_risk,
      COUNT(*) FILTER (WHERE status = 'complete')::int AS complete,
      COUNT(*) FILTER (WHERE category = 'frontend')::int AS frontend,
      COUNT(*) FILTER (WHERE category = 'database')::int AS database,
      COUNT(*) FILTER (WHERE category = 'authentication')::int AS authentication,
      COUNT(*) FILTER (WHERE category = 'devops')::int AS devops,
      COUNT(*) FILTER (WHERE category = 'full_stack')::int AS full_stack,
      COUNT(*) FILTER (WHERE category = 'analytics')::int AS analytics,
      COUNT(*) FILTER (WHERE priority = 'low')::int AS low,
      COUNT(*) FILTER (WHERE priority = 'medium')::int AS medium,
      COUNT(*) FILTER (WHERE priority = 'high')::int AS high
    FROM projects
  `);

  const row = projectResult.rows[0];
  for (const [group, keys] of Object.entries(buckets)) {
    const sum = keys.reduce((total, key) => total + Number(row[key] ?? 0), 0);
    if (sum !== Number(row.total)) {
      throw new Error(`${group} counts do not sum to total projects.`);
    }
  }

  const integrity = await client.query(`
    SELECT COUNT(*)::int AS orphan_tasks
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    WHERE p.id IS NULL
  `);
  if (Number(integrity.rows[0].orphan_tasks) !== 0) {
    throw new Error("Orphan task records detected.");
  }

  console.log(JSON.stringify({
    projects: row,
    orphanTasks: Number(integrity.rows[0].orphan_tasks)
  }, null, 2));
} finally {
  await client.end();
}

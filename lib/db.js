/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import pg from "pg";

const { Pool } = pg;

const globalForDb = globalThis;

export const pool =
  globalForDb.__week6Pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__week6Pool = pool;
}

export async function query(text, params = []) {
  return pool.query(text, params);
}

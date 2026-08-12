/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();
import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Client } = pg;
const reset = process.argv.includes("--reset");
const connectionString = process.env.DATABASE_URL;
const SEED_VERSION = "2026-08-12-final-9-projects-v2";

if (!connectionString) {
  console.error("DATABASE_URL is missing. Copy .env.example to .env.local or export DATABASE_URL first.");
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000
});

await client.connect();
try {
  if (reset) {
    await client.query("DROP TABLE IF EXISTS app_seed_meta; DROP TABLE IF EXISTS tasks; DROP TABLE IF EXISTS projects;");
  }

  const schema = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  await client.query(schema);
  await client.query(`
    CREATE TABLE IF NOT EXISTS app_seed_meta (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      seed_version TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const current = await client.query("SELECT seed_version FROM app_seed_meta WHERE id = 1");
  const alreadySeeded = current.rows[0]?.seed_version === SEED_VERSION;

  if (!alreadySeeded) {
    const seed = await readFile(path.join(process.cwd(), "db", "seed.sql"), "utf8");
    // seed.sql truncates teaching data and loads the current version.
    await client.query(seed);
    console.log(`Database seed ${SEED_VERSION} loaded.`);
  } else {
    console.log(`Database already at seed ${SEED_VERSION}; existing project data was preserved.`);
  }
} finally {
  await client.end();
}

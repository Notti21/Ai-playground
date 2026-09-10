#!/usr/bin/env node
// Thin forward-only migration runner for Store Care Program.
//
// Applies every migrations/NNNN_*.sql that has not yet been recorded in the
// schema_migrations table, in filename order, each in its own transaction.
//
// Usage:
//   SUPABASE_DB_URL=postgres://... node scripts/migrate.mjs
//   (or put SUPABASE_DB_URL in .env.local)
//
// This script is the ONLY code that connects to Postgres directly. Application
// code never imports it and never uses the direct connection string.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, "..", "migrations");

function loadDbUrl() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;
  // Fallback: read SUPABASE_DB_URL from .env.local without adding a dep.
  try {
    const envFile = readFileSync(join(here, "..", ".env.local"), "utf8");
    for (const line of envFile.split("\n")) {
      const m = line.match(/^\s*SUPABASE_DB_URL\s*=\s*(.*)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — fall through */
  }
  return "";
}

const dbUrl = loadDbUrl();
if (!dbUrl) {
  console.error(
    "ERROR: SUPABASE_DB_URL is not set (env or .env.local).\n" +
      "This is a deployment prerequisite (C1): the Supabase project must exist first.",
  );
  process.exit(1);
}

const files = readdirSync(migrationsDir)
  .filter((f) => /^\d+_.*\.sql$/.test(f))
  .sort();

if (files.length === 0) {
  console.log("No migration files found.");
  process.exit(0);
}

const client = new pg.Client({ connectionString: dbUrl });
await client.connect();

try {
  await client.query(`
    create table if not exists schema_migrations (
      filename    text primary key,
      applied_at  timestamptz not null default now()
    )
  `);

  const { rows } = await client.query("select filename from schema_migrations");
  const applied = new Set(rows.map((r) => r.filename));

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file} (already applied)`);
      continue;
    }
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    console.log(`apply ${file} ...`);
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into schema_migrations (filename) values ($1)", [file]);
      await client.query("commit");
      count += 1;
      console.log(`ok    ${file}`);
    } catch (err) {
      await client.query("rollback");
      console.error(`FAIL  ${file}: ${err.message}`);
      process.exit(1);
    }
  }

  console.log(count === 0 ? "Nothing to apply." : `Applied ${count} migration(s).`);
} finally {
  await client.end();
}

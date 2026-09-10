#!/usr/bin/env bash
# Portability guard (tech-stack decision, principle 7): a one-command full export
# of the Store Care Program database. The dump is plain SQL and restores into any
# standard Postgres — it does not depend on Supabase.
#
# Usage:
#   SUPABASE_DB_URL=postgres://... bash scripts/export-db.sh
#   (or put SUPABASE_DB_URL in .env.local)
#
# Requires the postgresql client tools (pg_dump) on PATH.
# Output: db-exports/store-care-<UTC timestamp>.sql  (gitignored)

set -euo pipefail

cd "$(dirname "$0")/.."

DB_URL="${SUPABASE_DB_URL:-}"
if [ -z "$DB_URL" ] && [ -f .env.local ]; then
  DB_URL="$(grep -E '^\s*SUPABASE_DB_URL\s*=' .env.local | head -n1 | sed -E 's/^[^=]*=\s*//; s/^["'"'"']//; s/["'"'"']$//')"
fi

if [ -z "$DB_URL" ]; then
  echo "ERROR: SUPABASE_DB_URL is not set (env or .env.local)." >&2
  echo "This is a deployment prerequisite (C1): the Supabase project must exist first." >&2
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "ERROR: pg_dump not found. Install the PostgreSQL client tools." >&2
  exit 1
fi

mkdir -p db-exports
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="db-exports/store-care-${STAMP}.sql"

# --no-owner / --no-privileges keep the dump portable across roles.
# Schema + data for the application tables; Supabase-managed schemas are excluded.
pg_dump "$DB_URL" \
  --no-owner \
  --no-privileges \
  --schema=public \
  --file="$OUT"

echo "Wrote $OUT"
echo "Restore into a clean database with:  psql \"\$TARGET_DB_URL\" -f $OUT"

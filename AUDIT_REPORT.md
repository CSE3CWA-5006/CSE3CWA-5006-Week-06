# Final Audit — Folio Advanced Full-Stack Project Portal

Date: 2026-08-12
Author: Dr Shuo Ding <shuoding@outlook.com>
License: GNU Affero General Public License v3.0 or later

## Correctness and consistency fixes

- Moved the server-rendered application shell into the page request so sidebar counts and project metrics are refreshed from the same database snapshot as the visible project list.
- Replaced separate dashboard/filter queries in the main page with one PostgreSQL `REPEATABLE READ` snapshot query.
- Unified status, category and priority counts and project-name buckets from the same row set.
- Fixed stale-count behavior after create, update and bulk delete by revalidating the page and forcing a client refresh after successful mutations.
- Bulk deletion remains transactional and uses the existing PostgreSQL `ON DELETE CASCADE` relationship.
- Added project-ID validation so invalid IDs return a controlled application error instead of producing database-side failures.
- Added an explicit `db:verify` command to check that status/category/priority buckets sum to the project total and that no orphan task records exist.
- Bumped the seed version to `2026-08-12-final` so the first setup on an older teaching database loads the current clean dataset, while later setup runs preserve user changes.
- Added a public copy of the AGPL license for the application's legal-notice link.
- Added the requested author copyright notice and disclaimer to the application footer, README, and source program headers.

## Verification performed

- All `.js` and `.mjs` files pass `node --check`.
- `run_ubuntu.sh` passes `bash -n`.
- All program/config source files carry the project copyright header where comments are supported.
- No source module in `app/` or `components/` still fetches the old persistent sidebar summary independently of the page snapshot.

Full browser/PostgreSQL integration execution could not be performed in this build environment because PostgreSQL is not available here; run `./run_ubuntu.sh` followed by `npm run db:verify` on the target Ubuntu/PostgreSQL machine before classroom use.

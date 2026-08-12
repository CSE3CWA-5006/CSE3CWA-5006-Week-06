-- Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
-- Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.

TRUNCATE TABLE tasks, projects RESTART IDENTITY CASCADE;

INSERT INTO projects (name, owner, status, category, priority, progress, summary, due_date)
VALUES
  ('Client Onboarding Hub', 'Ava', 'on_track', 'frontend', 'medium', 62,
   'A guided onboarding workspace for new customers with setup checklists, account handover and progress visibility.', CURRENT_DATE + 18),
  ('Retail Inventory Forecast', 'Noah', 'planning', 'analytics', 'high', 18,
   'A forecasting workspace that combines sales history and stock levels to flag likely replenishment needs.', CURRENT_DATE + 38),
  ('Secure Patient Portal', 'Mia', 'at_risk', 'authentication', 'high', 48,
   'A patient-facing portal for secure sign-in, appointment access and protected document delivery.', CURRENT_DATE + 12),
  ('Team Knowledge Base', 'Leo', 'complete', 'full_stack', 'low', 100,
   'An internal knowledge hub with searchable articles, ownership metadata and simple publishing workflows.', CURRENT_DATE - 6),
  ('API Usage Monitor', 'Grace', 'on_track', 'devops', 'medium', 74,
   'A service dashboard for tracking request volume, latency and error rates across internal APIs.', CURRENT_DATE + 9),
  ('Invoice Reconciliation', 'Daniel', 'complete', 'database', 'low', 100,
   'A finance workflow for matching invoices with payment records and highlighting unresolved differences.', CURRENT_DATE - 12),
  ('Event Operations Console', 'Sofia', 'planning', 'full_stack', 'medium', 32,
   'An operations console for venue schedules, staffing changes, guest lists and event-day coordination.', CURRENT_DATE + 27),
  ('Accessibility Audit Tracker', 'Ethan', 'at_risk', 'frontend', 'low', 41,
   'A lightweight workspace for recording accessibility findings, assigning owners and tracking remediation.', CURRENT_DATE + 16);

INSERT INTO app_seed_meta (seed_version)
VALUES ('2026-08-12-final')
ON CONFLICT (id) DO UPDATE SET seed_version = EXCLUDED.seed_version, updated_at = NOW();

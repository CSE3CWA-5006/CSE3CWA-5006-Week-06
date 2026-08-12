-- Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
-- Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.

TRUNCATE TABLE tasks, projects RESTART IDENTITY CASCADE;

-- 9 projects, deliberately spread evenly across every facet so the sidebar
-- filters (status/category/priority) all have something real to show and
-- combining filters doesn't dead-end into an empty grid:
--   status:   on_track x3, planning x2, at_risk x2, complete x2
--   category: frontend x2, full_stack x2, analytics x2, database x1, authentication x1, devops x1
--   priority: high x3, medium x3, low x3
INSERT INTO projects (name, owner, status, category, priority, progress, summary, due_date)
VALUES
  ('Marketing Site Redesign', 'Priya', 'on_track', 'frontend', 'high', 65,
   'A refreshed public site with a faster page shell, updated messaging and a component-driven layout system.', CURRENT_DATE + 21),
  ('Customer Data Warehouse', 'Marcus', 'planning', 'database', 'medium', 15,
   'A central warehouse consolidating product, billing and support data behind one queryable schema.', CURRENT_DATE + 45),
  ('Single Sign-On Rollout', 'Elena', 'at_risk', 'authentication', 'high', 40,
   'Organisation-wide SSO covering the web app, admin console and internal tools behind one identity provider.', CURRENT_DATE + 9),
  ('Release Pipeline Automation', 'Owen', 'on_track', 'devops', 'medium', 72,
   'Automated build, test and deploy pipeline replacing the manual release checklist across every service.', CURRENT_DATE + 14),
  ('Partner Billing Platform', 'Farah', 'complete', 'full_stack', 'low', 100,
   'Usage-based billing for partner accounts, including invoicing, credit handling and payment retries.', CURRENT_DATE - 8),
  ('Churn Prediction Model', 'Kenji', 'planning', 'analytics', 'high', 8,
   'A model surfacing at-risk accounts early using engagement and support-ticket signals.', CURRENT_DATE + 52),
  ('Support Ticket Triage Bot', 'Ines', 'at_risk', 'full_stack', 'medium', 35,
   'Automatic ticket classification and routing to cut first-response time for the support team.', CURRENT_DATE + 11),
  ('Design System Component Library', 'Priya', 'complete', 'frontend', 'low', 100,
   'A shared, themeable component library that replaced five inconsistent in-house implementations.', CURRENT_DATE - 15),
  ('Infrastructure Cost Dashboard', 'Owen', 'on_track', 'analytics', 'low', 58,
   'A live view of cloud spend by team and service, with budget alerts before month-end overruns.', CURRENT_DATE + 24);

INSERT INTO app_seed_meta (seed_version)
VALUES ('2026-08-12-nine-projects-v4')
ON CONFLICT (id) DO UPDATE SET seed_version = EXCLUDED.seed_version, updated_at = NOW();

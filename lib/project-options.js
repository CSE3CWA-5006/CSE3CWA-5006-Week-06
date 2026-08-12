/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

export const PROJECT_STATUSES = [
  ["planning", "Planning"],
  ["on_track", "On track"],
  ["at_risk", "At risk"],
  ["complete", "Complete"]
];

export const PROJECT_CATEGORIES = [
  ["frontend", "Frontend"],
  ["database", "Database"],
  ["authentication", "Authentication"],
  ["devops", "DevOps"],
  ["full_stack", "Full stack"],
  ["analytics", "Analytics"]
];

export const PROJECT_PRIORITIES = [
  ["low", "Low"],
  ["medium", "Medium"],
  ["high", "High"]
];

export const PROJECT_STATUS_KEYS = PROJECT_STATUSES.map(([value]) => value);

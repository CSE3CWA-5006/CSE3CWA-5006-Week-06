/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "./project-options.js";

const labels = Object.fromEntries([
  ...PROJECT_STATUSES,
  ...PROJECT_CATEGORIES,
  ...PROJECT_PRIORITIES,
  ["todo", "To do"],
  ["in_progress", "In progress"],
  ["blocked", "Blocked"],
  ["done", "Done"]
]);

export function labelFor(value) {
  return labels[value] ?? value ?? "—";
}

export function formatDate(value) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

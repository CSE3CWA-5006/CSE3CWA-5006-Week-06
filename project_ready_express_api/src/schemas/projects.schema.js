/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

import { z } from "zod";

const statusSchema = z.enum(["planning", "on_track", "at_risk", "complete"]);
const categorySchema = z.enum(["frontend", "database", "authentication", "devops"]);
const prioritySchema = z.enum(["low", "medium", "high"]);

export const projectCreateSchema = z.object({
  name: z.string().trim().min(3).max(80),
  owner: z.string().trim().min(2).max(60),
  status: statusSchema,
  category: categorySchema,
  priority: prioritySchema,
  progress: z.number().int().min(0).max(100)
});

export const projectUpdateSchema = projectCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be provided for update."
});

export const projectQuerySchema = z.object({
  status: statusSchema.optional(),
  category: categorySchema.optional(),
  search: z.string().trim().max(80).optional(),
  sortBy: z.enum(["id", "name", "owner", "status", "category", "priority", "progress"]).default("id"),
  order: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

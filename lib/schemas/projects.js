/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { z } from "zod";
import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "../project-options.js";

export const projectStatusSchema = z.enum(PROJECT_STATUSES.map(([value]) => value));
export const projectCategorySchema = z.enum(PROJECT_CATEGORIES.map(([value]) => value));
export const prioritySchema = z.enum(PROJECT_PRIORITIES.map(([value]) => value));

const optionalDate = z
  .union([z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
  .optional()
  .transform((value) => (value ? value : null));

export const projectCreateSchema = z.object({
  name: z.string().trim().min(3).max(80),
  owner: z.string().trim().min(2).max(60),
  status: projectStatusSchema.default("planning"),
  category: projectCategorySchema,
  priority: prioritySchema.default("medium"),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  summary: z.string().trim().max(500).default(""),
  dueDate: optionalDate
});

export const projectUpdateSchema = projectCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "At least one project field must be provided." }
);

export const projectQuerySchema = z.object({
  search: z.string().trim().max(80).optional().default(""),
  status: z.union([projectStatusSchema, z.literal("")]).optional().default(""),
  category: z.union([projectCategorySchema, z.literal("")]).optional().default(""),
  priority: z.union([prioritySchema, z.literal("")]).optional().default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

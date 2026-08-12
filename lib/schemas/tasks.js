/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { z } from "zod";
import { prioritySchema } from "./projects.js";

export const taskStatusSchema = z.enum(["todo", "in_progress", "blocked", "done"]);

const optionalDate = z
  .union([z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("")])
  .optional()
  .transform((value) => (value ? value : null));

export const taskCreateSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  title: z.string().trim().min(3).max(120),
  assignee: z.string().trim().max(60).default(""),
  status: taskStatusSchema.default("todo"),
  priority: prioritySchema.default("medium"),
  dueDate: optionalDate
});

export const taskUpdateSchema = taskCreateSchema
  .omit({ projectId: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one task field must be provided."
  });

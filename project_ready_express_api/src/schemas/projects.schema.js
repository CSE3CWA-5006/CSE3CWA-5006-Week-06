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

/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { AppError } from "../errors.js";
import { projectCreateSchema, projectQuerySchema, projectUpdateSchema } from "../schemas/projects.js";
import * as repository from "../repositories/projects.repository.js";

function applyBusinessRules(project) {
  if (project.progress === 100 && project.status !== "complete") {
    throw new AppError(400, "A project at 100% progress must have status complete.");
  }

  if (project.status === "complete" && project.progress !== 100) {
    throw new AppError(400, "A completed project must have 100% progress.");
  }
}

export async function listProjects(rawQuery = {}) {
  const parsed = projectQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new AppError(400, "Project query is invalid.", parsed.error.flatten());
  }
  return repository.findProjects(parsed.data);
}

function parseProjectId(id) {
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    throw new AppError(400, "Project ID must be a positive integer.");
  }
  return numericId;
}

export async function getProject(id) {
  const numericId = parseProjectId(id);
  const project = await repository.findProjectById(numericId);
  if (!project) throw new AppError(404, `Project ${id} was not found.`);
  return project;
}

export async function createProject(rawInput) {
  const parsed = projectCreateSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new AppError(400, "Project data is invalid.", parsed.error.flatten());
  }
  applyBusinessRules(parsed.data);
  return repository.createProject(parsed.data);
}

export async function updateProject(id, rawInput) {
  const existing = await getProject(id);
  const parsed = projectUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new AppError(400, "Project update is invalid.", parsed.error.flatten());
  }

  const merged = { ...existing, ...parsed.data };
  applyBusinessRules(merged);

  const updated = await repository.updateProject(parseProjectId(id), parsed.data);
  if (!updated) throw new AppError(404, `Project ${id} was not found.`);
  return updated;
}

export async function deleteProject(id) {
  const deleted = await repository.deleteProject(parseProjectId(id));
  if (!deleted) throw new AppError(404, `Project ${id} was not found.`);
  return deleted;
}

export async function deleteProjects(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError(400, "Select at least one project to delete.");
  }

  const numericIds = [...new Set(ids.map(Number))];
  if (numericIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
    throw new AppError(400, "One or more selected project IDs are invalid.");
  }

  const deleted = await repository.deleteProjects(numericIds);
  if (deleted.length !== numericIds.length) {
    throw new AppError(404, "One or more selected projects could not be found.");
  }
  return deleted;
}

export async function getDashboardSummary() {
  return repository.getDashboardSummary();
}

export async function getFilterSummary() {
  return repository.getFilterSummary();
}

export async function getDashboardData(rawQuery = {}) {
  const parsed = projectQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    throw new AppError(400, "Project query is invalid.", parsed.error.flatten());
  }
  return repository.getDashboardData(parsed.data);
}

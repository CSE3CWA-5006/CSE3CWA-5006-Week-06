/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

import { AppError } from "../utils.js";
import * as repository from "../repositories/projects.repository.js";

export function listProjects(query) {
  return repository.findProjects(query);
}

export function getProject(id) {
  const project = repository.findProjectById(id);
  if (!project) {
    throw new AppError(404, `Project ${id} was not found.`);
  }
  return project;
}

export function createProject(input) {
  if (input.progress === 100 && input.status !== "complete") {
    throw new AppError(400, "A project with 100% progress should have status 'complete'.");
  }

  return repository.createProject(input);
}

export function updateProject(id, input) {
  const existing = repository.findProjectById(id);
  if (!existing) {
    throw new AppError(404, `Project ${id} was not found.`);
  }

  const nextProject = {
    ...existing,
    ...input
  };

  if (nextProject.progress === 100 && nextProject.status !== "complete") {
    throw new AppError(400, "A project with 100% progress should have status 'complete'.");
  }

  return repository.updateProject(id, input);
}

export function deleteProject(id) {
  const deleted = repository.deleteProject(id);
  if (!deleted) {
    throw new AppError(404, `Project ${id} was not found.`);
  }
  return deleted;
}

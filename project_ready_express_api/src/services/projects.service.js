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

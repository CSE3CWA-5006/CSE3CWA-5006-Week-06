/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { AppError } from "../errors.js";
import { taskCreateSchema, taskUpdateSchema } from "../schemas/tasks.js";
import * as taskRepository from "../repositories/tasks.repository.js";
import * as projectRepository from "../repositories/projects.repository.js";

export async function listTasks(projectId) {
  const project = await projectRepository.findProjectById(Number(projectId));
  if (!project) throw new AppError(404, `Project ${projectId} was not found.`);
  return taskRepository.findTasksByProject(Number(projectId));
}

export async function createTask(rawInput) {
  const parsed = taskCreateSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new AppError(400, "Task data is invalid.", parsed.error.flatten());
  }

  const project = await projectRepository.findProjectById(parsed.data.projectId);
  if (!project) throw new AppError(404, `Project ${parsed.data.projectId} was not found.`);

  if (project.status === "complete" && parsed.data.status !== "done") {
    throw new AppError(400, "A completed project cannot receive a new unfinished task.");
  }

  return taskRepository.createTask(parsed.data);
}

export async function updateTask(id, rawInput) {
  const existing = await taskRepository.findTaskById(Number(id));
  if (!existing) throw new AppError(404, `Task ${id} was not found.`);

  const parsed = taskUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new AppError(400, "Task update is invalid.", parsed.error.flatten());
  }

  const updated = await taskRepository.updateTask(Number(id), parsed.data);
  if (!updated) throw new AppError(404, `Task ${id} was not found.`);
  return updated;
}

export async function deleteTask(id) {
  const deleted = await taskRepository.deleteTask(Number(id));
  if (!deleted) throw new AppError(404, `Task ${id} was not found.`);
  return deleted;
}

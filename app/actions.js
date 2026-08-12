/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use server";

import { revalidatePath } from "next/cache";
import { createProject, deleteProject, deleteProjects, updateProject } from "../lib/services/projects.service.js";
import { createTask, deleteTask, updateTask } from "../lib/services/tasks.service.js";
import { publicError } from "../lib/errors.js";

function value(formData, name) {
  return formData.get(name)?.toString() ?? "";
}

export async function createProjectAction(previousState, formData) {
  try {
    const project = await createProject({
      name: value(formData, "name"),
      owner: value(formData, "owner"),
      status: value(formData, "status"),
      category: value(formData, "category"),
      priority: value(formData, "priority"),
      progress: value(formData, "progress"),
      summary: value(formData, "summary"),
      dueDate: value(formData, "dueDate")
    });

    revalidatePath("/", "page");
    // Return the saved row itself (not just its id) so the client can apply
    // it straight to the in-memory dashboard. Re-reading the <form> after
    // the action resolves is not safe: React resets uncontrolled form
    // fields back to their defaultValue once a form action completes, so a
    // FormData snapshot taken afterwards would silently capture the OLD
    // values instead of what the user just submitted.
    return { ok: true, message: `Project “${project.name}” created.`, projectId: project.id, project };
  } catch (error) {
    const result = publicError(error);
    return { ok: false, message: result.message, projectId: null, project: null };
  }
}

export async function updateProjectAction(previousState, formData) {
  try {
    const id = Number(value(formData, "id"));
    const project = await updateProject(id, {
      name: value(formData, "name"),
      owner: value(formData, "owner"),
      status: value(formData, "status"),
      category: value(formData, "category"),
      priority: value(formData, "priority"),
      progress: value(formData, "progress"),
      summary: value(formData, "summary"),
      dueDate: value(formData, "dueDate")
    });

    revalidatePath("/", "page");
    // See the comment in createProjectAction: the saved row is returned
    // directly so the client never has to re-read the (by-then reset) form.
    return { ok: true, message: "Project updated.", project };
  } catch (error) {
    const result = publicError(error);
    return { ok: false, message: result.message, project: null };
  }
}

export async function deleteProjectAction(formData) {
  try {
    const id = Number(value(formData, "id"));
    const deleted = await deleteProject(id);
    revalidatePath("/", "page");
    return { ok: true, message: `Project “${deleted.name}” deleted.` };
  } catch (error) {
    const result = publicError(error);
    return { ok: false, message: result.message };
  }
}

export async function deleteProjectsAction(previousState, formData) {
  try {
    const ids = JSON.parse(value(formData, "ids"));
    const deleted = await deleteProjects(ids);
    revalidatePath("/", "page");
    return {
      ok: true,
      message: `${deleted.length} project${deleted.length === 1 ? "" : "s"} deleted.`,
      deletedIds: deleted.map((item) => Number(item.id))
    };
  } catch (error) {
    const result = publicError(error);
    return { ok: false, message: result.message, deletedIds: [] };
  }
}

export async function createTaskAction(previousState, formData) {
  try {
    const task = await createTask({
      projectId: value(formData, "projectId"),
      title: value(formData, "title"),
      assignee: value(formData, "assignee"),
      status: value(formData, "status"),
      priority: value(formData, "priority"),
      dueDate: value(formData, "dueDate")
    });

    revalidatePath("/", "page");
    return { ok: true, message: `Task “${task.title}” created.` };
  } catch (error) {
    const result = publicError(error);
    return { ok: false, message: result.message };
  }
}

export async function updateTaskAction(previousState, formData) {
  try {
    const id = Number(value(formData, "id"));
    await updateTask(id, {
      status: value(formData, "status"),
      priority: value(formData, "priority")
    });
    revalidatePath("/", "page");
    return { ok: true, message: "Task updated." };
  } catch (error) {
    const result = publicError(error);
    return { ok: false, message: result.message };
  }
}

export async function deleteTaskAction(formData) {
  const id = Number(value(formData, "id"));
  await deleteTask(id);
  revalidatePath("/", "page");
}

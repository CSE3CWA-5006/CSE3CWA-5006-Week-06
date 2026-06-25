/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";

const dataFile = path.join(process.cwd(), "data", "projects.json");

async function readProjectFile() {
  const file = await fs.readFile(dataFile, "utf8");
  return JSON.parse(file);
}

async function writeProjectFile(projects) {
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2));
}

function cleanText(value) {
  return String(value || "").trim();
}

export async function getProjects() {
  const projects = await readProjectFile();
  return projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getProjectSummary() {
  const projects = await getProjects();

  return {
    total: projects.length,
    planned: projects.filter((project) => project.status === "planned").length,
    inProgress: projects.filter((project) => project.status === "in_progress").length,
    complete: projects.filter((project) => project.status === "complete").length
  };
}

export async function createProject(input) {
  const title = cleanText(input.title);
  const owner = cleanText(input.owner);
  const status = cleanText(input.status || "planned");
  const priority = cleanText(input.priority || "medium");

  if (title.length < 3) {
    throw new Error("Project title must contain at least three characters.");
  }

  if (owner.length < 2) {
    throw new Error("Owner name must contain at least two characters.");
  }

  const allowedStatus = ["planned", "in_progress", "complete"];
  const allowedPriority = ["low", "medium", "high"];

  if (!allowedStatus.includes(status)) {
    throw new Error("Status must be planned, in_progress or complete.");
  }

  if (!allowedPriority.includes(priority)) {
    throw new Error("Priority must be low, medium or high.");
  }

  const projects = await readProjectFile();
  const project = {
    id: randomUUID(),
    title,
    owner,
    status,
    priority,
    createdAt: new Date().toISOString()
  };

  projects.push(project);
  await writeProjectFile(projects);
  return project;
}

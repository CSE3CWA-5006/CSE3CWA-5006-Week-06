import { created, ok } from "../utils.js";
import * as service from "../services/projects.service.js";

export function listProjects(req, res) {
  const result = service.listProjects(req.validated.query);
  ok(res, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages
  });
}

export function getProject(req, res) {
  const project = service.getProject(req.validated.params.id);
  ok(res, project);
}

export function createProject(req, res) {
  const project = service.createProject(req.validated.body);
  created(res, project);
}

export function updateProject(req, res) {
  const project = service.updateProject(req.validated.params.id, req.validated.body);
  ok(res, project);
}

export function deleteProject(req, res) {
  const project = service.deleteProject(req.validated.params.id);
  ok(res, project);
}

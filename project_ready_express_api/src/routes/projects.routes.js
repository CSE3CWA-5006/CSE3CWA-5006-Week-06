import { Router } from "express";
import * as controller from "../controllers/projects.controller.js";
import { authRequired } from "../middleware/authRequired.js";
import { validate } from "../middleware/validate.js";
import {
  idParamSchema,
  projectCreateSchema,
  projectQuerySchema,
  projectUpdateSchema
} from "../schemas/projects.schema.js";

export const projectsRouter = Router();

projectsRouter.get("/", validate({ query: projectQuerySchema }), controller.listProjects);
projectsRouter.get("/:id", validate({ params: idParamSchema }), controller.getProject);
projectsRouter.post("/", authRequired, validate({ body: projectCreateSchema }), controller.createProject);
projectsRouter.patch(
  "/:id",
  authRequired,
  validate({ params: idParamSchema, body: projectUpdateSchema }),
  controller.updateProject
);
projectsRouter.delete("/:id", authRequired, validate({ params: idParamSchema }), controller.deleteProject);

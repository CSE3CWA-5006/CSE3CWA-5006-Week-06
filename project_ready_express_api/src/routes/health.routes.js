import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({
    ok: true,
    data: {
      service: "project-ready-express-api",
      status: "healthy",
      timestamp: new Date().toISOString()
    }
  });
});

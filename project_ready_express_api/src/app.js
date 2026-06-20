import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";

export function createApp() {
  const app = express();
  const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

  app.use(helmet());
  app.use(cors({ origin: frontendOrigin }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api/health", healthRouter);
  app.use("/api/projects", projectsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

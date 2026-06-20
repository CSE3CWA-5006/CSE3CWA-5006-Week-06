import { ZodError } from "zod";
import { AppError } from "../utils.js";

export function notFound(req, res) {
  res.status(404).json({
    ok: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`
    }
  });
}

export function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    res.status(400).json({
      ok: false,
      error: {
        message: "Request validation failed.",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      }
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      ok: false,
      error: {
        message: error.message,
        ...(error.details ? { details: error.details } : {})
      }
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    ok: false,
    error: {
      message: "Unexpected server error."
    }
  });
}

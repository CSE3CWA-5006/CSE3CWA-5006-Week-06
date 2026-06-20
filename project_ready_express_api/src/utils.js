export function ok(res, data, meta = undefined, statusCode = 200) {
  res.status(statusCode).json({
    ok: true,
    data,
    ...(meta ? { meta } : {})
  });
}

export function created(res, data) {
  ok(res, data, undefined, 201);
}

export class AppError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

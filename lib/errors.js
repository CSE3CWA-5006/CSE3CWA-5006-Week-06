/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

export class AppError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

export function publicError(error) {
  if (error instanceof AppError) {
    return {
      status: error.status,
      message: error.message,
      details: error.details
    };
  }

  console.error(error);
  return {
    status: 500,
    message: "An unexpected server error occurred.",
    details: null
  };
}

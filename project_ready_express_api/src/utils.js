/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

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

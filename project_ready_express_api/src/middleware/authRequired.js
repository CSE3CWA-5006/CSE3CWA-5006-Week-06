/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

export function authRequired(req, res, next) {
  const expectedKey = process.env.DEMO_API_KEY || "week6-demo-key";
  const providedKey = req.header("x-api-key");

  if (providedKey !== expectedKey) {
    res.status(401).json({
      ok: false,
      error: {
        message: "A valid x-api-key header is required for this route."
      }
    });
    return;
  }

  next();
}

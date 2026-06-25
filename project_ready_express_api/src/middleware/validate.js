/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

export function validate({ body, query, params }) {
  return (req, res, next) => {
    try {
      req.validated = {
        ...(req.validated || {}),
        ...(body ? { body: body.parse(req.body) } : {}),
        ...(query ? { query: query.parse(req.query) } : {}),
        ...(params ? { params: params.parse(req.params) } : {})
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}

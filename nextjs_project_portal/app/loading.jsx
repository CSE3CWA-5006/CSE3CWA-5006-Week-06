/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

export default function Loading() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Loading</p>
          <h1>Preparing project data...</h1>
          <p className="hero-copy">
            Next.js can show a loading boundary while a route is preparing data.
          </p>
        </div>
      </section>
    </main>
  );
}

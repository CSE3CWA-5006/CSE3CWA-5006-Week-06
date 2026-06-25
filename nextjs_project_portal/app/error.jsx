"use client";

/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

export default function Error({ error, reset }) {
  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Something went wrong</p>
          <h1>The project portal could not load.</h1>
          <p className="hero-copy">{error.message}</p>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}

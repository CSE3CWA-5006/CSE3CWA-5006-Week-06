/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

export function LoadingState() {
  return (
    <section className="state-box">
      <div className="skeleton wide" />
      <div className="skeleton" />
      <div className="skeleton short" />
      <p>Loading project data...</p>
    </section>
  );
}

export function EmptyState() {
  return (
    <section className="state-box">
      <h2>No matching projects</h2>
      <p>Try a different search term or choose another status filter.</p>
    </section>
  );
}

export function ErrorState({ message, onDismiss }) {
  return (
    <section className="error-box" role="alert">
      <div>
        <strong>Something needs attention</strong>
        <p>{message}</p>
      </div>
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </section>
  );
}

/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

export default function ProjectDetail({ project }) {
  if (!project) {
    return (
      <aside className="detail-panel">
        <h2>No project selected</h2>
        <p>Select a project to see its details.</p>
      </aside>
    );
  }

  return (
    <aside className="detail-panel">
      <span className="category">{project.category}</span>
      <h2>{project.name}</h2>
      <p>{project.summary}</p>
      <dl className="detail-list">
        <div>
          <dt>Owner</dt>
          <dd>{project.owner}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.status}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{project.priority}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{project.updated}</dd>
        </div>
      </dl>
      <div className="detail-note">
        <strong>Design point</strong>
        <p>
          The detail panel uses selected item state. On desktop it sits beside the list.
          On mobile it moves below the cards.
        </p>
      </div>
    </aside>
  );
}

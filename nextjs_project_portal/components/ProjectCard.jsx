/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

const statusLabels = {
  planned: "Planned",
  in_progress: "In progress",
  complete: "Complete"
};

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div>
        <h3>{project.title}</h3>
        <p>Owner: {project.owner}</p>
      </div>
      <div className="card-meta">
        <span className={`status ${project.status}`}>
          {statusLabels[project.status] || project.status}
        </span>
        <span className="priority">{project.priority} priority</span>
      </div>
    </article>
  );
}

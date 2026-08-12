/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

import { formatDate, labelFor } from "../lib/format.js";
import { ProjectEditButton } from "./ProjectFormModal.jsx";

export default function ProjectCard({ project, selected, onToggleSelect }) {
  return (
    <article className={`project-card-shell${selected ? " is-selected" : ""}`}>
      <label className="project-select" title={`Select ${project.name}`}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          aria-label={`Select ${project.name}`}
        />
        <span className="project-select-box" aria-hidden="true" />
      </label>

      <ProjectEditButton project={project} className="project-card-trigger">
        <span className="project-card-head project-card-head-with-selection">
          <span className="category">{labelFor(project.category)}</span>
          <span className={`status-badge status-${project.status}`}>
            <span className="status-dot" aria-hidden="true" />
            {labelFor(project.status)}
          </span>
        </span>

        <span className="project-card-center">
          <span className="project-card-primary">
            <strong className="project-card-name">{project.name}</strong>
            <span className="project-card-label">Owner · {project.owner}</span>
          </span>
        </span>

        <span className="card-progress">
          <span className="progress-row">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </span>
          <span className="progress-track" aria-hidden="true">
            <span style={{ width: `${project.progress}%` }} />
          </span>
        </span>

        <span className="card-meta">
          <span>{labelFor(project.priority)} priority</span>
          <span>{formatDate(project.dueDate)}</span>
        </span>
      </ProjectEditButton>
    </article>
  );
}

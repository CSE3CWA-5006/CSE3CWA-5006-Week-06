function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-");
}

export default function ProjectCard({ project, isSelected, onSelect }) {
  return (
    <button
      className={`project-card ${isSelected ? "selected" : ""}`}
      type="button"
      onClick={() => onSelect(project.id)}
      aria-pressed={isSelected}
    >
      <div className="project-card-head">
        <div>
          <span className="category">{project.category}</span>
          <h3>{project.name}</h3>
        </div>
        <span className={`status-badge ${statusClass(project.status)}`}>{project.status}</span>
      </div>
      <p>{project.summary}</p>
      <div className="progress-row">
        <span>Progress</span>
        <strong>{project.progress}%</strong>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div style={{ width: `${project.progress}%` }} />
      </div>
      <div className="card-meta">
        <span>Owner: {project.owner}</span>
        <span>{project.updated}</span>
      </div>
    </button>
  );
}

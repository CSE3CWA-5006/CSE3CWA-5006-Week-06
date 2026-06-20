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

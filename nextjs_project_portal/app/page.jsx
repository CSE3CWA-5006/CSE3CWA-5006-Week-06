import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import { createProjectAction } from "./actions";
import { getProjects, getProjectSummary } from "../lib/projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects();
  const summary = await getProjectSummary();

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Week 6 final React chapter</p>
          <h1>Next.js Project Portal</h1>
          <p className="hero-copy">
            This small project shows how a modern React framework can render pages,
            handle interactive components, receive form submissions and expose API
            endpoints from one organised application.
          </p>
        </div>
        <div className="summary-panel" aria-label="Project summary">
          <span>{summary.total}</span>
          <p>Total projects</p>
        </div>
      </section>

      <section className="metrics" aria-label="Project status summary">
        <article>
          <strong>{summary.planned}</strong>
          <span>Planned</span>
        </article>
        <article>
          <strong>{summary.inProgress}</strong>
          <span>In progress</span>
        </article>
        <article>
          <strong>{summary.complete}</strong>
          <span>Complete</span>
        </article>
      </section>

      <section className="workspace">
        <ProjectForm action={createProjectAction} />

        <div className="project-list">
          <div className="section-heading">
            <p className="eyebrow">Server-rendered data</p>
            <h2>Current projects</h2>
          </div>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}

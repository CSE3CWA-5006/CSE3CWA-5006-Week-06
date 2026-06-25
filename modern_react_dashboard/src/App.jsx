/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

import AppShell from "./components/AppShell.jsx";
import FilterBar from "./components/FilterBar.jsx";
import MetricCard from "./components/MetricCard.jsx";
import ProjectCard from "./components/ProjectCard.jsx";
import ProjectDetail from "./components/ProjectDetail.jsx";
import { EmptyState, ErrorState, LoadingState } from "./components/StateMessage.jsx";
import { useProjects } from "./hooks/useProjects.js";

export default function App() {
  const {
    projects,
    filteredProjects,
    selectedProject,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    selectedId,
    setSelectedId,
    isLoading,
    error,
    simulateError,
    clearError
  } = useProjects();

  const averageProgress =
    projects.length === 0
      ? 0
      : Math.round(projects.reduce((total, project) => total + project.progress, 0) / projects.length);

  return (
    <AppShell>
      <main id="dashboard" className="dashboard">
        <section className="intro-panel">
          <div>
            <h2>From demo code to product-style UI</h2>
            <p>
              This dashboard demonstrates component structure, state design, responsive layout,
              feedback states and visual hierarchy in one small React project.
            </p>
          </div>
          <div className="intro-tags" aria-label="Covered React ideas">
            <span>components</span>
            <span>state</span>
            <span>custom hook</span>
            <span>responsive UI</span>
          </div>
        </section>

        <section className="metrics-grid" aria-label="Project summary">
          <MetricCard label="Projects" value={projects.length} helper="Total loaded projects" />
          <MetricCard label="Visible" value={filteredProjects.length} helper="After search and filter" />
          <MetricCard label="Average progress" value={`${averageProgress}%`} helper="Derived from project state" />
        </section>

        <FilterBar
          query={query}
          statusFilter={statusFilter}
          onQueryChange={setQuery}
          onStatusChange={setStatusFilter}
          onSimulateError={simulateError}
        />

        {error && <ErrorState message={error} onDismiss={clearError} />}

        {isLoading ? (
          <LoadingState />
        ) : (
          <section className="content-grid">
            <div className="project-list" id="projects">
              {filteredProjects.length === 0 ? (
                <EmptyState />
              ) : (
                filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isSelected={project.id === selectedId}
                    onSelect={setSelectedId}
                  />
                ))
              )}
            </div>
            <ProjectDetail project={selectedProject} />
          </section>
        )}
      </main>
    </AppShell>
  );
}

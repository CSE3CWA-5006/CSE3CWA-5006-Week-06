/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

import { useEffect, useMemo, useState, useActionState } from "react";
import ProjectCard from "./ProjectCard.jsx";
import { deleteProjectsAction } from "../app/actions.js";
import { useDashboard } from "./DashboardProvider.jsx";

const initialState = { ok: null, message: "", deletedIds: [] };

export default function ProjectGrid() {
  const { projectResult, removeProjects, activeFilter } = useDashboard();
  const projects = projectResult.items;
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [state, formAction, pending] = useActionState(deleteProjectsAction, initialState);

  const selectedProjects = useMemo(
    () => projects.filter((project) => selectedIds.includes(Number(project.id))),
    [projects, selectedIds]
  );

  useEffect(() => {
    const visibleIds = new Set(projects.map((project) => Number(project.id)));
    setSelectedIds((current) => current.filter((id) => visibleIds.has(id)));
    setConfirmOpen((current) => current && projects.some((project) => visibleIds.has(Number(project.id))));
  }, [projects]);

  useEffect(() => {
    if (selectedIds.length === 0) setConfirmOpen(false);
  }, [selectedIds.length]);

  useEffect(() => {
    if (!state?.ok) return;
    // Update the in-memory dataset immediately so the grid, the sidebar
    // counts and the "All projects" total all reflect the deletion right
    // away — no server round-trip needed for the deletion to be visible,
    // it already committed server-side before this state was returned.
    removeProjects(state.deletedIds);
    setSelectedIds((current) => current.filter((id) => !state.deletedIds.includes(id)));
    setConfirmOpen(false);
    // No router.refresh() here — see the comment in ProjectFormModal.jsx.
    // The deletion above already reflects what the server committed; a
    // refresh's re-fetch can suspend the app/loading.jsx boundary and
    // remount this whole subtree while it re-renders, which is what made
    // the sidebar/tag counts appear to "zero out" after a delete until a
    // stray click (e.g. "All projects") forced a fresh, correct render.
  }, [state, removeProjects]);

  function toggleProject(id) {
    const numericId = Number(id);
    setSelectedIds((current) => (
      current.includes(numericId)
        ? current.filter((item) => item !== numericId)
        : [...current, numericId]
    ));
  }

  function closeConfirmation() {
    if (!pending) setConfirmOpen(false);
  }

  return (
    <section className="project-section" aria-label="Project list">
      <div className="result-meta">
        <span>{projectResult.total} projects</span>
        {activeFilter ? <span className="result-filtered">Filtered view</span> : null}
      </div>

      {projects.length ? (
        <div className="project-grid-area">
          {selectedIds.length ? (
            <div className="selection-bar" role="status">
              <span>{selectedIds.length} selected</span>
              <button
                type="button"
                className="button button-danger"
                onClick={() => setConfirmOpen(true)}
                disabled={pending}
              >
                Delete selected
              </button>
            </div>
          ) : null}

          <div className="project-grid" aria-label="Projects">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                selected={selectedIds.includes(Number(project.id))}
                onToggleSelect={() => toggleProject(project.id)}
              />
            ))}
          </div>

          {confirmOpen ? (
            <div
              className="modal-backdrop"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeConfirmation();
              }}
            >
              <section
                className="modal-sheet delete-confirm-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-confirm-title"
              >
                <header className="modal-header">
                  <div>
                    <p className="eyebrow">Confirm deletion</p>
                    <h2 id="delete-confirm-title">Delete selected projects?</h2>
                    <p className="modal-subtitle">The following projects will be permanently deleted.</p>
                  </div>
                  <button type="button" className="icon-button" aria-label="Close" onClick={closeConfirmation} disabled={pending}>×</button>
                </header>

                <div className="delete-list" aria-label="Projects to delete">
                  {selectedProjects.map((project) => (
                    <div key={project.id} className="delete-list-item">{project.name}</div>
                  ))}
                </div>

                <form action={formAction}>
                  <input type="hidden" name="ids" value={JSON.stringify(selectedProjects.map((project) => Number(project.id)))} />
                  <div className="modal-footer">
                    <div className="modal-result" aria-live="polite">
                      {state.message ? <span className={state.ok ? "result-success" : "result-error"}>{state.message}</span> : null}
                    </div>
                    <div className="modal-actions">
                      <button type="button" className="button button-ghost" onClick={closeConfirmation} disabled={pending}>Cancel</button>
                      <button type="submit" className="button button-danger" disabled={pending}>
                        {pending ? "Deleting…" : "Delete permanently"}
                      </button>
                    </div>
                  </div>
                </form>
              </section>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="state-box">
          <div className="empty-icon">—</div>
          <h3>No matching projects</h3>
          <p>Try another search or filter.</p>
        </div>
      )}
    </section>
  );
}

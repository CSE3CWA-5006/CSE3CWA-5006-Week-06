/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

import { useEffect, useMemo, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "./ProjectCard.jsx";
import { deleteProjectsAction } from "../app/actions.js";

const initialState = { ok: null, message: "", deletedIds: [] };

export default function ProjectGrid({ projects }) {
  const router = useRouter();
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
  }, [projects]);

  useEffect(() => {
    if (!state?.ok) return;
    setSelectedIds((current) => current.filter((id) => !state.deletedIds.includes(id)));
    setConfirmOpen(false);
    router.refresh();
  }, [state?.ok, state?.deletedIds, router]);

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
    <>
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

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={selectedIds.includes(Number(project.id))}
          onToggleSelect={() => toggleProject(project.id)}
        />
      ))}

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
    </>
  );
}

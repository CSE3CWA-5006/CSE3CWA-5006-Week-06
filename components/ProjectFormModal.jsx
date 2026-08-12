/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createProjectAction, updateProjectAction } from "../app/actions.js";
import { PROJECT_CATEGORIES, PROJECT_PRIORITIES, PROJECT_STATUSES } from "../lib/project-options.js";
import { useDashboard } from "./DashboardProvider.jsx";

const emptyState = { ok: null, message: "", projectId: null, project: null };

function Field({ label, children }) {
  return <label className="modal-field"><span>{label}</span>{children}</label>;
}

export default function ProjectFormModal({ project = null, triggerLabel, variant = "primary", children, className = "" }) {
  const { addProject, replaceProject } = useDashboard();
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);
  const action = project ? updateProjectAction : createProjectAction;
  const [state, formAction, pending] = useActionState(action, emptyState);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  const handledStateRef = useRef(null);

  useEffect(() => {
    if (!state?.ok || state === handledStateRef.current) return;
    handledStateRef.current = state;

    // Apply the row the server actually saved. Deliberately NOT re-reading
    // the <form> here: once a form action resolves, React resets any
    // uncontrolled fields back to their defaultValue, so a FormData
    // snapshot taken at this point would silently capture what the field
    // looked like when the modal opened, not what the user just saved —
    // that mismatch is exactly what made edits appear to "not take" until
    // a full page reload re-fetched the real data from the database.
    if (state.project) {
      if (project) {
        replaceProject(state.project);
      } else {
        addProject({ taskCount: 0, doneTaskCount: 0, ...state.project });
      }
    }

    setOpen(false);

    // Deliberately NOT calling router.refresh() here. This route is wrapped
    // by app/loading.jsx, and a refresh's re-fetch can suspend that
    // boundary and swap the whole page out for the loading fallback while
    // it re-renders — which briefly unmounts this entire client subtree,
    // discarding the update just applied above (and everyone else's tag
    // selection) until the new payload lands. The dataset above is already
    // the row the server actually persisted, so there is nothing left for
    // a refresh to correct — it can only make things worse.
  }, [state, project, replaceProject, addProject]);

  const close = () => {
    if (!pending) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label={project ? `Edit ${project.name}` : triggerLabel}
        className={`modal-trigger ${className || ""} ${variant === "primary" ? "modal-trigger-primary" : "modal-trigger-ghost"}`}
        onClick={() => setOpen(true)}
      >
        {children ?? triggerLabel}
      </button>

      {open ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close();
        }}>
          <section className="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="project-form-title">
            <header className="modal-header">
              <div>
                <p className="eyebrow">{project ? "Edit project" : "New project"}</p>
                <h2 id="project-form-title">{project ? project.name : "Create a project"}</h2>
                <p className="modal-subtitle">A single project editor for new and existing work.</p>
              </div>
              <button type="button" className="icon-button" aria-label="Close" onClick={close}>×</button>
            </header>

            <form ref={formRef} action={formAction} className="project-form">
              {project ? <input type="hidden" name="id" value={project.id} /> : null}

              <div className="form-section">
                <div className="form-section-title">Project details</div>
                <div className="form-grid two">
                  <Field label="Project name">
                    <input name="name" required minLength={3} defaultValue={project?.name ?? ""} placeholder="e.g. Smart Campus Portal" />
                  </Field>
                  <Field label="Owner">
                    <input name="owner" required minLength={2} defaultValue={project?.owner ?? ""} placeholder="e.g. Jordan" />
                  </Field>
                </div>
                <Field label="Summary">
                  <textarea name="summary" rows="3" maxLength={500} defaultValue={project?.summary ?? ""} placeholder="What problem does this project solve?" />
                </Field>
              </div>

              <div className="form-section">
                <div className="form-section-title">Planning</div>
                <div className="form-grid three">
                  <Field label="Status">
                    <select name="status" defaultValue={project?.status ?? "planning"}>
                      {PROJECT_STATUSES.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                    </select>
                  </Field>
                  <Field label="Category">
                    <select name="category" defaultValue={project?.category ?? "full_stack"}>
                      {PROJECT_CATEGORIES.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                    </select>
                  </Field>
                  <Field label="Priority">
                    <select name="priority" defaultValue={project?.priority ?? "medium"}>
                      {PROJECT_PRIORITIES.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="form-grid two">
                  <Field label="Progress (%)">
                    <input name="progress" type="number" min="0" max="100" defaultValue={project?.progress ?? 0} />
                  </Field>
                  <Field label="Due date">
                    <input name="dueDate" type="date" defaultValue={project?.dueDate ? String(project.dueDate).slice(0, 10) : ""} />
                  </Field>
                </div>
              </div>

              <div className="modal-footer">
                <div className="modal-result" aria-live="polite">
                  {state.message ? <span className={state.ok ? "result-success" : "result-error"}>{state.message}</span> : null}
                </div>
                <div className="modal-actions">
                  <button type="button" className="button button-ghost" onClick={close} disabled={pending}>Cancel</button>
                  <button type="submit" className="button button-primary" disabled={pending}>
                    {pending ? "Saving…" : project ? "Save changes" : "Create project"}
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

export function ProjectCreateButton() {
  return <ProjectFormModal triggerLabel="New project" />;
}

export function ProjectEditButton({ project, children }) {
  return (
    <ProjectFormModal project={project} variant="ghost" className="project-card-trigger">
      {children}
    </ProjectFormModal>
  );
}

"use client";

/*
 * Week 6 — CSE3CWA / CSE5006 teaching materials
 * Copyright (c) 2026 Dr Shuo Ding <shuoding@outlook.com>
 * Licensed under the GNU Affero General Public License v3.0 or later
 * (AGPL-3.0-or-later). Any copy, modification, or distribution must retain
 * this copyright notice and remain under the AGPL. See the LICENSE file.
 */

import { useActionState, useEffect, useRef } from "react";

const initialState = {
  ok: null,
  message: ""
};

export default function ProjectForm({ action }) {
  const formRef = useRef(null);
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="project-form">
      <div className="section-heading">
        <p className="eyebrow">Client component</p>
        <h2>Create a project</h2>
      </div>

      <label>
        Project title
        <input name="title" placeholder="e.g. Accessibility audit" required />
      </label>

      <label>
        Owner
        <input name="owner" placeholder="e.g. Jordan" required />
      </label>

      <div className="form-grid">
        <label>
          Status
          <select name="status" defaultValue="planned">
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
            <option value="complete">Complete</option>
          </select>
        </label>

        <label>
          Priority
          <select name="priority" defaultValue="medium">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Create project"}
      </button>

      {state?.message ? (
        <p className={state.ok ? "message success" : "message error"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

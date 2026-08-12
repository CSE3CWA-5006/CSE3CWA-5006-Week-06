/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

"use client";

export default function ErrorPage({ error, reset }) {
  return (
    <main className="dashboard">
      <section className="state-box error-box" role="alert">
        <p className="eyebrow">Something went wrong</p>
        <h2>The portal could not load its server data.</h2>
        <p>{error?.message || "Check the database connection and try again."}</p>
        <button className="primary-button" type="button" onClick={() => reset()}>Try again</button>
      </section>
    </main>
  );
}

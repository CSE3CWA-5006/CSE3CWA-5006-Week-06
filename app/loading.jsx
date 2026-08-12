/* Copyright © 2026 Dr Shuo Ding <shuoding@outlook.com>.
 * Licensed under GNU Affero General Public License v3.0 or later. See LICENSE.
 */

export default function Loading() {
  return (
    <main className="dashboard">
      <section className="state-box loading-box">
        <p className="eyebrow">Loading</p>
        <h2>Preparing the project portal...</h2>
        <p>Next.js is reading the latest project data from the server.</p>
      </section>
    </main>
  );
}

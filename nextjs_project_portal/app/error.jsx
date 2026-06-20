"use client";

export default function Error({ error, reset }) {
  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Something went wrong</p>
          <h1>The project portal could not load.</h1>
          <p className="hero-copy">{error.message}</p>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}

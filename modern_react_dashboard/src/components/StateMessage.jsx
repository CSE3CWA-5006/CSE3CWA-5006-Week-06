export function LoadingState() {
  return (
    <section className="state-box">
      <div className="skeleton wide" />
      <div className="skeleton" />
      <div className="skeleton short" />
      <p>Loading project data...</p>
    </section>
  );
}

export function EmptyState() {
  return (
    <section className="state-box">
      <h2>No matching projects</h2>
      <p>Try a different search term or choose another status filter.</p>
    </section>
  );
}

export function ErrorState({ message, onDismiss }) {
  return (
    <section className="error-box" role="alert">
      <div>
        <strong>Something needs attention</strong>
        <p>{message}</p>
      </div>
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </section>
  );
}
